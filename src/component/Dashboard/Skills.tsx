// src/components/SkillsProDark.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {fetchSkills,addSkill,updateSkill,deleteSkill,} from "../redux/skillsSlice";
import {Box,Stack,Typography,Button,Chip,Dialog,DialogContent,TextField,useTheme,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../loading";
import { toast } from "react-toastify";

export default function SkillsProDark() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const primaryBlue = theme.palette.primary.main;
  const { list, loading, error } = useSelector((state: RootState) => state.skills);
  const [openModal, setOpenModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleSave = async () => {
    if (!skillInput.trim()) return;

    const toastId = toast.loading(editMode ? "Updating skill..." : "Adding skill...");

    try {
      if (editMode) {
        await dispatch(
          updateSkill({ oldSkill: editMode, newSkill: skillInput.trim() })
        ).unwrap();
        toast.update(toastId, {
          render: "Skill updated successfully ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await dispatch(addSkill(skillInput.trim())).unwrap();
        toast.update(toastId, {
          render: "Skill added successfully ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      setSkillInput("");
      setEditMode(null);
      setOpenModal(false);
    } catch {
      toast.update(toastId, {
        render: "Operation failed ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (skill: string) => {
    setSkillInput(skill);
    setEditMode(skill);
    setOpenModal(true);
  };

  const handleDelete = async (skill: string) => {
    const toastId = toast.loading("Deleting skill...");
    try {
      await dispatch(deleteSkill(skill)).unwrap();
      toast.update(toastId, {
        render: "Skill deleted successfully ",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch {
      toast.update(toastId, {
        render: "Failed to delete skill ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ p: { xs: 2, md: 7 }, bgcolor: "#181818ff", mt: 13 }}>
          <Stack direction="row" justifyContent="space-between" mb={3}>
            <Typography variant="h5" color="#fff" fontWeight={700}>
              Skills
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(true);
                setEditMode(null);
                setSkillInput("");
              }}
            >
              Add Skill
            </Button>
          </Stack>

          {error && <Typography color="error">{error}</Typography>}

          <Stack direction="row" gap={2} flexWrap="wrap">
            {list.map((skill, index) => (
            <Chip
              key={`${skill}-${index}`}  
              label={skill}
              onDelete={() => handleDelete(skill)}
              sx={{
                fontSize: "0.9rem",
                px: 1.5,
                borderRadius: "10px",
                bgcolor: "#1e1e2f",
                color: "#fff",
                border: `1px solid #333`,
                "& .MuiChip-deleteIcon": { color: "#ff5555" },
              }}
              onClick={() => handleEdit(skill)}
            />
          ))}
          </Stack>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                bgcolor: "#121212",
                borderRadius: 4,
                border: `2px solid ${primaryBlue}`,
                p: 3,
              },
            }}
          >
            <DialogContent>
              <Stack spacing={3}>
                <Typography color="#fff" fontWeight={700}>
                  {editMode ? "Edit Skill" : "Add Skill"}
                </Typography>

                <TextField
                  label="Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  fullWidth
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  InputProps={{
                    style: { color: "#fff", backgroundColor: "#1e1e1e", borderRadius: 6 },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </>
  );
}