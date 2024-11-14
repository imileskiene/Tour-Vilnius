import * as React from "react";
// import { Box, Button, Modal, ModalDialog } from '@mui/material';
import Box from "@mui/joy/Box";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
// import Typography from '@mui/joy/Typography';
// import { useLoaderData } from 'react-router-dom';
import NewTourRegistrationForm from "./tours/NewTourRegistrationForm";

export default function ResponsiveModal({ tour }) {
  // console.log(`responsivemodeli`, tour);
  
  //   const data =  useLoaderData()
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          marginRight: 1,
          backgroundColor: "#4CAF50",
          color: "#000000",
          textTransform: "uppercase",
          fontWeight: "normal",
          "&:hover": {
            backgroundColor: "#388E3C",
          },
        }}
        onClick={() => setOpen(true)}
      >
        Redaguoti
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            width: "80%", // Set the width to 80% of the parent container
            maxWidth: "600px", // Set a max-width for larger screens
            overflow: "scroll",
            [theme.breakpoints.only("xs")]: {
              width: "100%", // Set the width to 80% of the parent container
              // maxWidth: '600px',
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: "none",
              maxWidth: "unset",
            },
          })}
        >
          <NewTourRegistrationForm
            tour={tour}
            setOpen={setOpen}
          />
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            <Button
              id="danger"
              variant="outlined"
              color="danger"
              onClick={() => setOpen(false)}
            >
              Atšaukti
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
