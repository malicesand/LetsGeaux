import React, { useEffect, useState } from 'react';
import api from './api';
import {
  Typography,
  CircularProgress,
  LinearProgress,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';

interface BudgetEntry {
  id: number;
  category: string;
  notes: string;
  limit: number;
  spent?: number;
}

interface Props {
  selectedItineraryId: number | null;
}

const BudgetOverview: React.FC<Props> = ({ selectedItineraryId }) => {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetEntry | null>(null);
  const [editForm, setEditForm] = useState({ category: '', limit: '', notes: '', spent: '' });
  const [updatedEntryId, setUpdatedEntryId] = useState<number | null>(null);
  // state to keep track of which thresholds have been notified for each budget
  const [notified, setNotified] = useState<{ [budgetId: number]: { [threshold: number]: boolean } }>({});
  const { enqueueSnackbar } = useSnackbar();

  // fefine the thresholds
  const thresholds = [25, 50, 75, 90];

  const fetchBudgets = async () => {
    if (!selectedItineraryId) return;
    setLoading(true);
    try {
      const res = await api.get(`/budget?partyId=${selectedItineraryId}`);
      setBudgets(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error('Fetch budget error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedItineraryId]);

  // check each budget entry for threshold crossings
  useEffect(() => {
    budgets.forEach(budget => {
      if (budget.limit > 0) {
        const percentage = ((budget.spent || 0) / budget.limit) * 100;
        thresholds.forEach(threshold => {
          if (percentage >= threshold) {
            // only show notification if not already notified for this budget and threshold
            if (!(notified[budget.id]?.[threshold])) {
              enqueueSnackbar(`${budget.category} is at ${threshold}% usage!`, {
                variant: 'warning',
              });
              setNotified(prev => ({
                ...prev,
                [budget.id]: {
                  ...prev[budget.id],
                  [threshold]: true,
                },
              }));
            }
          }
        });
      }
    });
  }, [budgets, enqueueSnackbar, thresholds, notified]);

  const openEditModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setEditForm({
      category: budget.category,
      limit: budget.limit.toString(),
      notes: budget.notes,
      spent: budget.spent?.toString() || '0'
    });
    setEditOpen(true);
  };

  const openDeleteModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setDeleteOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedBudget) return;
    try {
      await api.put(`/budget/${selectedBudget.id}`, {
        ...editForm,
        limit: parseFloat(editForm.limit),
        spent: parseFloat(editForm.spent),
      });
      setUpdatedEntryId(selectedBudget.id);
      fetchBudgets();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setEditOpen(false);
      setTimeout(() => setUpdatedEntryId(null), 2000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBudget) return;
    try {
      await api.delete(`/budget/${selectedBudget.id}`);
      fetchBudgets();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteOpen(false);
    }
  };

  if (!selectedItineraryId) {
    return <Typography sx={{ m: 4 }}>Select an itinerary to view budget entries.</Typography>;
  }

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (budgets.length === 0) return <Typography sx={{ m: 4 }}>No budget entries found.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Budget Overview</Typography>

      {budgets.map((budget) => {
        const percent = budget.spent ? (budget.spent / budget.limit) * 100 : 0;

        return (
          <Box
            key={budget.id}
            sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}
          >
            <Typography variant="h6">{budget.category}</Typography>
            <Typography>{budget.notes}</Typography>
            <Typography variant="body2">
              ${budget.spent?.toFixed(2) || 0} of ${budget.limit}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{ height: 10, borderRadius: 5, mt: 1 }}
              color={percent < 50 ? 'primary' : percent < 85 ? 'warning' : 'error'}
            />
            <Stack direction="row" spacing={1} mt={2}>
              <Button size="small" variant="outlined" onClick={() => openEditModal(budget)}>Edit</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => openDeleteModal(budget)}>Delete</Button>
              {updatedEntryId === budget.id && <Chip label="Updated!" color="success" size="small" />}
            </Stack>
          </Box>
        );
      })}

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Budget Entry</DialogTitle>
        <DialogContent>
          <TextField label="Category" fullWidth margin="dense" value={editForm.category} disabled />
          <TextField label="Limit" type="number" fullWidth margin="dense" value={editForm.limit} onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })} />
          <TextField label="Spent" type="number" fullWidth margin="dense" value={editForm.spent} onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })} />
          <TextField label="Notes" fullWidth margin="dense" multiline value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetOverview;
