// src/components/Dashboard/EducationProDark.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {fetchEducation,addEducation,updateEducation,deleteEducation,} from "../redux/educationSlice";
import {Box,Card,CardContent,Typography,Button,Stack,Dialog,DialogContent,TextField,IconButton,Tooltip,Chip,useTheme,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import Loading from "../loading";
import { toast } from "react-toastify";

const emptyForm = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  description: "",
  achievement: "",
};

export default function EducationProDark() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { list, loading, error } = useSelector((state: RootState) => state.education);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setOpen(true);
  };

  const openEdit = (edu: any) => {
    setForm(edu);
    setEditId(edu._id);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.school || !form.degree) return;

    const toastId = toast.loading(editId ? "Updating education..." : "Adding education...");

    try {
      if (editId) {
        await dispatch(updateEducation({ eduId: editId, updates: form })).unwrap();
        toast.update(toastId, {
          render: "Education updated successfully ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await dispatch(addEducation(form)).unwrap();
        toast.update(toastId, {
          render: "Education added successfully ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
    } catch {
      toast.update(toastId, {
        render: "Operation failed ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting education...");
    try {
      await dispatch(deleteEducation(id)).unwrap();
      toast.update(toastId, {
        render: "Education deleted successfully  ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch {
      toast.update(toastId, {
        render: "Failed to delete education  ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const primaryBlue = theme.palette.primary.main;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card
          sx={{
            p: 3,
            mt: 10,
            borderRadius: 3,
            backdropFilter: "blur(14px)",
            bgcolor: "#121212",
          }}
        >
          <CardContent>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight={700} color="#FFF">
                Education
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  background: primaryBlue,
                  color: "#FFF",
                  "&:hover": { backgroundColor: `${primaryBlue}CC` },
                }}
                onClick={openAdd}
              >
                Add Education
              </Button>
            </Stack>

            {error && <Typography color="error">{error}</Typography>}

            {/* Timeline */}
            <Box sx={{ position: "relative", pl: 6 }}>
              <Box
                sx={{
                  position: "absolute",
                  left: 14,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  bgcolor: "#555",
                  borderRadius: 1,
                  opacity: 0.5,
                }}
              />
              <Stack spacing={5}>
                {list.map((edu: any) => (
                  <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box position="relative">
                      {/* Dot */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: -22,
                          top: 3,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${primaryBlue}FF 0%, ${primaryBlue}AA 70%)`,
                          boxShadow: `0 0 12px ${primaryBlue}BB, 0 0 20px ${primaryBlue}88, 0 0 28px ${primaryBlue}55`,
                          border: `2px solid ${primaryBlue}`,
                        }}
                      />

                      {/* Education Card */}
                      <Card
                        sx={{
                          p: 2.5,
                          cursor: "pointer",
                          borderRadius: 3,
                          border: "1px solid #1E1E2F",
                          bgcolor: "#1E1E2F",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                          transition: "0.3s",
                          position: "relative",
                          "&:hover": {
                            boxShadow: "0 14px 32px rgba(0,0,0,0.15)",
                            border: `1px solid ${primaryBlue}`,
                            ".edu-actions": { opacity: 1 },
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              fontWeight={700}
                              fontSize={17}
                              color="#FFF"
                            >
                              {edu.school}
                            </Typography>
                            <Typography fontSize={14} color="#ccc">
                              {edu.degree}
                              {edu.fieldOfStudy && ` · ${edu.fieldOfStudy}`}
                            </Typography>
                            <Typography fontSize={13} color="#aaa">
                              {edu.startDate?.slice(0, 4)} –{" "}
                              {edu.endDate ? edu.endDate.slice(0, 4) : "Present"}
                            </Typography>
                            {edu.description && (
                              <Typography fontSize={14} mt={1} color="#eee">
                                {edu.description}
                              </Typography>
                            )}
                            {edu.achievement && (
                              <Chip
                                label={`⭐ ${edu.achievement}`}
                                size="small"
                                sx={{
                                  mt: 1,
                                  background: primaryBlue,
                                  color: "#FFF",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>

                          {/* Edit/Delete Actions */}
                          <Stack
                            direction="row"
                            spacing={0.5}
                            className="edu-actions"
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              opacity: 0,
                              transition: "opacity 0.3s",
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => openEdit(edu)}
                              >
                                <EditIcon
                                  fontSize="small"
                                  sx={{ color: primaryBlue }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(edu._id)}
                              >
                                <DeleteIcon
                                  fontSize="small"
                                  sx={{ color: "#FF5555" }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </Card>
                    </Box>
                  </motion.div>
                ))}
              </Stack>

              {list.length === 0 && (
                <Typography color="#888" mt={4}>
                  No education added yet
                </Typography>
              )}
            </Box>
          </CardContent>

          {/* Add/Edit Modal */}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, y: -30 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -30 },
              transition: { duration: 0.3 },
              sx: {
                borderRadius: 4,
                bgcolor: "#121212",
                backdropFilter: "blur(20px)",
                border: `2px solid ${primaryBlue}`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
              },
            }}
          >
            <DialogContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700} color="#FFF">
                  {editId ? "Edit Education" : "Add Education"}
                </Typography>

                <TextField
                  label="School"
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      border: "2px solid #333",
                      borderRadius: 4,
                    },
                  }}
                />
                <TextField
                  label="Degree"
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      border: "2px solid #333",
                      borderRadius: 4,
                    },
                  }}
                />
                <TextField
                  label="Field of Study"
                  value={form.fieldOfStudy}
                  onChange={(e) =>
                    setForm({ ...form, fieldOfStudy: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      border: "2px solid #333",
                      borderRadius: 4,
                    },
                  }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true, style: { color: "#ccc" } }}
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    fullWidth
                    InputProps={{
                      style: {
                        color: "#fff",
                        border: "2px solid #333",
                        borderRadius: 4,
                      },
                    }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true, style: { color: "#ccc" } }}
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    fullWidth
                    InputProps={{
                      style: {
                        color: "#fff",
                        border: "2px solid #333",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Stack>

                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      border: "2px solid #333",
                      borderRadius: 4,
                    },
                  }}
                />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    sx={{
                      color: "#ccc",
                      border: "1px solid #333",
                      "&:hover": { backgroundColor: "#1f1f1f" },
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      background: primaryBlue,
                      color: "#FFF",
                       "&:hover": { backgroundColor: `${primaryBlue}CC` },
                    }}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>
        </Card>
      )}
    </>
  );
}