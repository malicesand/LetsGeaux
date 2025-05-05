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
  Chip,
  IconButton
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useBudgetNotifications } from './BudgetNotificationContext';
// Import PiTrash icon from react icons
import { PiTrash } from 'react-icons/pi';

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
  // State definitions
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetEntry | null>(null);
  const [editForm, setEditForm] = useState({ category: '', limit: '', notes: '', spent: '' });
  const [updatedEntryId, setUpdatedEntryId] = useState<number | null>(null);
  const [notified, setNotified] = useState<{ [budgetId: number]: { [threshold: number]: boolean } }>({});
  const { enqueueSnackbar } = useSnackbar();
  const { addNotification } = useBudgetNotifications();

  // Threshold percentages for notifications
  const thresholds = [40, 50, 75, 90, 95];

  //fetch budgets when selectedItineraryId changes
  const fetchBudgets = async () => {
    if (!selectedItineraryId) return;
    setLoading(true);
    try {
      const res = await api.get(`/budget?partyId=${selectedItineraryId}`);
      setBudgets(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error('Fetch budget error:', err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedItineraryId]);

  //check for threshold crossings and notify
  useEffect(() => {
    budgets.forEach(budget => {
      if (budget.limit > 0) {
        const percent = ((budget.spent || 0) / budget.limit) * 100;
        thresholds.forEach(th => {
          if (percent >= th && !notified[budget.id]?.[th]) {
            enqueueSnackbar(`${budget.category} is at ${th}% usage!`, { variant: 'warning' });
            addNotification({ message: `${budget.category} is at ${th}% usage!`, timestamp: new Date() });
            setNotified(prev => ({
              ...prev,
              [budget.id]: { ...prev[budget.id], [th]: true }
            }));
          }
        });
      }
    });
  }, [budgets, enqueueSnackbar, addNotification, notified]);

  //open edit dialog
  const openEditModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setEditForm({
      category: budget.category,
      limit: budget.limit.toString(),
      notes: budget.notes,
      spent: (budget.spent ?? 0).toString(),
    });
    setEditOpen(true);
  };

  //open delete confirmation
  const openDeleteModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setDeleteOpen(true);
  };

  //handle save after editing
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

  //handle delete confirmation
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

  //early returns for states
  if (!selectedItineraryId) {
    return <Typography sx={{ m: 4 }}>Select an itinerary to view budget entries.</Typography>;
  }
  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (budgets.length === 0) return <Typography sx={{ m: 4 }}>No budget entries found.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Budget Overview</Typography>

      {budgets.map(budget => {
        const percent = budget.spent ? (budget.spent / budget.limit) * 100 : 0;
        return (
          <Box
            key={budget.id}
            sx={{
              position: 'relative', // for absolutely positioned trash icon
              mb: 3,
              p: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              backgroundColor: '#f9f9f9'
            }}
          >
            {/* red trash icon in bottom right */}
            <IconButton
              aria-label="delete entry"
              onClick={() => openDeleteModal(budget)}
              color="error"
              sx={{ position: 'absolute', bottom: 8, right: 8, p: 0.5 }}
            >
              <PiTrash size={20} />
            </IconButton>

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
              <Button
                size="small"
                variant="text"
                sx={{ color: 'black' }} //make Edit button text black
                onClick={() => openEditModal(budget)}
              >
                Edit
              </Button>
              {updatedEntryId === budget.id && <Chip label="Updated!" color="success" size="small" />}
            </Stack>
          </Box>
        );
      })}

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle sx={{ color: 'black' }}>Edit Budget Entry</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2 }}>
          {/* added padding top/bottom */}
          <TextField
            label="Category"
            fullWidth
            margin="dense"
            value={editForm.category}
            disabled
            sx={{ mb: 2 }}                  //margin bottom
          />
          <TextField
            label="Limit"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.limit}
            onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
            sx={{ mb: 2 }}                  //margin bottom
          />
          <TextField
            label="Spent"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.spent}
            onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
            sx={{ mb: 2 }}                  //margin bottom
          />
          <TextField
            label="Notes"
            fullWidth
            margin="dense"
            multiline
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            sx={{ mb: 2 }}                  //margin bottom
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditOpen(false)}
            sx={{ color: 'black' }}         //make Cancel text black
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirmation modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ color: 'black' }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2 }}>
          {/*added padding top/bottom */}
          <Typography sx={{ color: 'black', mb: 2 }}>
            Are you sure you want to delete this entry?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ color: 'black' }}         //make Cancel text black
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteConfirm}   //wired up delete action
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetOverview;
