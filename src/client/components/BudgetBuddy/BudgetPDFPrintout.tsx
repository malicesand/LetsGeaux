import React, { useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import jsPDF from 'jspdf';

//define types for a budget category and the components props
interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
}

interface BudgetPDFPrintoutProps {
  // itinerary with a name field
  itinerary: { name: string };
  //array of budget categories with details
  budgetBreakdown: BudgetCategory[];
  // overall current budget value
  currentBudget: number;
}

const BudgetPDFPrintout: React.FC<BudgetPDFPrintoutProps> = ({ itinerary, budgetBreakdown, currentBudget }) => {
  //create a ref to the element to capture as PDF
  const printRef = useRef<HTMLDivElement>(null);

  //handler that uses jsPDFs built in html() method
  const handleGeneratePDF = async () => {
    if (printRef.current) {
      //create a new jsPDF document (portrait, A4)
      const pdf = new jsPDF('p', 'pt', 'a4');
      // use the html() method provided by jsPDF to convert element into PDF content
      await pdf.html(printRef.current, {
        callback: function (doc) {
          // save the PDF with a filename that includes the itinerary name
          doc.save(`${itinerary.name}-Budget.pdf`);
        },
        //specify coordinates and width to adjust positioning
        x: 10,
        y: 10,
        width: pdf.internal.pageSize.getWidth() - 20,
      });
    }
  };

  return (
    <Box>
      {/* button to trigger PDF generation */}
      <Button variant="contained" onClick={handleGeneratePDF} sx={{ mb: 2 }}>
        Generate PDF
      </Button>
      {/* this box is the area captured for the PDF */}
      <Box
        ref={printRef} /* element to capture for PDF */
        sx={{
          padding: 2,
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #ccc'
        }}
      >
        {/* itinerary title (printed at top of PDF) */}
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          {itinerary.name}
        </Typography>
        {/* budget Breakdown by Category */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Budget Breakdown:
        </Typography>
        {budgetBreakdown.map((cat) => (
          <Box key={cat.name} sx={{ my: 1 }}>
            <Typography variant="subtitle1">{cat.name}</Typography>
            <Typography variant="body2">
              Spent: ${cat.spent.toFixed(2)} | Limit: ${cat.limit.toFixed(2)}
            </Typography>
          </Box>
        ))}
        {/* current Budget Summary */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">
            Current Budget: ${currentBudget.toFixed(2)}
          </Typography>
        </Box>
        {/* timestamp printed at the bottom */}
        <Typography variant="caption" sx={{ mt: 4, display: 'block', textAlign: 'center' }}>
          Generated on: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default BudgetPDFPrintout;
