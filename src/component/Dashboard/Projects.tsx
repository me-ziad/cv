import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {fetchProjects,addProject,updateProject,deleteProject,deleteProjectImage,} from "../redux/projectsSlice";
import {Box,Card,CardContent,Typography,TextField,Button,Grid,Stack,Chip,Dialog,DialogContent,IconButton,Tooltip,useTheme,Divider, useMediaQuery,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../loading";
import { toast } from "react-toastify";


const emptyForm = {
  title: "",
  description: "",
  year: "",
  technologies: "",
  link: "",
};

export default function ProjectsProDark() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const primaryBlue = theme.palette.primary.main;
  const { list, loading, error } = useSelector((state: RootState) => state.projects,);
  const [form, setForm] = useState<any>(emptyForm);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState<string>("");
   const [currentSlide, setCurrentSlide] = useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [viewProjectId, setViewProjectId] = useState<string | null>(null);
    const viewProject = useMemo(
      () => list.find((p: any) => p._id === viewProjectId) || null,
      [list, viewProjectId]
    );


 useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // view project
   const viewProjects = useMemo(
    () => list.find((p: any) => p._id === viewProjectId),
    [list, viewProjectId]
  );

//  slider
  useEffect(() => {
    setCurrentSlide(0);
  }, [viewProject?.images?.length]);

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImages(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
    setMainImageIndex(0);
  };

  const removePreviewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setMainImageIndex(0);
  };

const handleAddOrUpdate = async (data?: any) => {
  const loadingToast = toast.loading(
    editMode ? "Updating project..." : "Adding project..."
  );

  try {
    const payloadForm = data || form;
    const techArray = technologies;

    if (images.length > 0) {
      const formData = new FormData();
      formData.append("title", payloadForm.title);
      formData.append("description", payloadForm.description);
      formData.append("year", payloadForm.year);
      formData.append("technologies", JSON.stringify(techArray));
      formData.append("link", payloadForm.link || "");
      images.forEach((img) => formData.append("images", img));
      formData.append("mainImageIndex", mainImageIndex.toString());

      if (editMode) {
        await dispatch(updateProject({ projectId: editMode._id, updates: formData })).unwrap();
        await dispatch(fetchProjects()).unwrap();  
        setViewProjectId(editMode._id); 
      } else {
        await dispatch(addProject(formData)).unwrap();
        await dispatch(fetchProjects()).unwrap();  
      }
    } else {
      const payload = {
        title: payloadForm.title,
        description: payloadForm.description,
        year: payloadForm.year,
        technologies: techArray,
        link: payloadForm.link || "",
      };

      if (editMode) {
        await dispatch(updateProject({ projectId: editMode._id, updates: payload })).unwrap();
        await dispatch(fetchProjects()).unwrap();
        setViewProjectId(editMode._id);
      } else {
        await dispatch(addProject(payload as any)).unwrap();
        await dispatch(fetchProjects()).unwrap();
      }
    }

    toast.update(loadingToast, {
      render: editMode ? "Project updated successfully  " : "Project added successfully  ",
      type: "success",
      isLoading: false,
      autoClose: 2500,
    });

    // reset form
    setForm(emptyForm);
    setImages([]);
    setPreview([]);
    setMainImageIndex(0);
    setTechnologies([]);
    setTechInput("");
    setEditMode(null);
    setOpenModal(false);
  } catch (err) {
    toast.update(loadingToast, {
      render: "Something went wrong  ",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

  const handleEdit = (proj: any) => {
    setForm({
      title: proj.title,
      description: proj.description,
      year: proj.year,
      technologies: proj.technologies.join(", "),
      link: proj.link || "",
    });
    setTechnologies(proj.technologies || []);
    setEditMode(proj);
    setOpenModal(true);
  };


 const handleDelete = async (id: string) => {
  const t = toast.loading("Deleting project...");

  try {
    await dispatch(deleteProject(id)).unwrap();
    toast.update(t, {
      render: "Project deleted",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch {
    toast.update(t, {
      render: "Failed to delete project",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

const handleDeleteImage = async (projectId: string, img: string) => {
  const t = toast.loading("Deleting image...");

  try {
    await dispatch(
      deleteProjectImage({ projectId, imagePath: img })
    ).unwrap();

    toast.update(t, {
      render: "Image deleted",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch {
    toast.update(t, {
      render: "Failed to delete image",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
}; 
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : (
        <Box sx={{ p:{xs:0,md: 3}, mt: 10 }}>
          <Stack direction="row" justifyContent="space-between" mb={3}>
            <Typography variant="h6" color="#fff" fontWeight={700}>
              Projects
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(true);
                setEditMode(null);
                setForm(emptyForm);
                setTechnologies([]);
              }}
            >
              Add Project
            </Button>
          </Stack>

          {error && <Typography color="error">{error}</Typography>}

     <Box sx={{ display: "flex", justifyContent: "center" }}>
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",  
        sm: "1fr 1fr",  
        md: "1fr 1fr 1fr", 
      },
      gap: 4,
      maxWidth: "1600px",
      width: "100%",
      px: 2,
    }}
  >
    {list.map((proj: any) => {
      const mainIdx = proj.mainImageIndex || 0;
      const mainImage = proj.images?.[mainIdx] || "";

      return (
        <Box
          key={proj._id}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            cursor: "pointer",
            position: "relative",
            height: 300, 
            display: "flex",
            flexDirection: "column",
            "&:hover .overlay": { opacity: 1 },
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={mainImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          {/* Hover Overlay */}
          <Box
            className="overlay"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              opacity: 0,
              transition: "0.3s",
            }}
          >
            <IconButton onClick={() => handleEdit(proj)}>
              <EditIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton
              sx={{ color: "#ff5555" }}
              onClick={() => setViewProjectId(proj._id)}
            >
              👁
            </IconButton>
            <IconButton onClick={() => handleDelete(proj._id)}>
              <DeleteIcon sx={{ color: "#ff5555" }} />
            </IconButton>
          </Box>

          {/* Title at bottom */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              bgcolor: "rgba(71, 71, 71, 0.82)",
              color: "#fff",
              py: 1,
              px: 1.5,
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {proj.title}
          </Box>
        </Box>
      );
    })}
  </Box>
</Box>
          {/* show project */}
          <Dialog
            open={Boolean(viewProject)}
            onClose={() => setViewProjectId(null)}
            maxWidth="2lg"
            fullWidth
             fullScreen={isSmallScreen} 
           PaperProps={{
                      sx: {
                        borderRadius: { xs: 0, md: 4 },  
                        bgcolor: "#121212",
                        backdropFilter: "blur(20px)",
                        border: { md: `2px solid ${primaryBlue}` },
                        boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
                        m: { xs: 0 },  
                       },
                    }}
          >
            {viewProject && (
              <DialogContent
                sx={{
                  bgcolor: "#121212",
                  p: { xs: 2, md: 7 },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" }, // responsive
                  overflow: "hidden",
                  position: "relative", 
                }}
              >
                {/* ================= CLOSE ICON ================= */}
                <IconButton
                  onClick={() => setViewProjectId(null)}
                  sx={{
                    position: "absolute",
                    top: { xs: 17, md: 16 },
                    right: { md: 16 },
                      bgcolor: "rgb(255, 255, 255)",
                    zIndex: 10,
                  }}
                >
                  <CloseIcon sx={{ color: "#ff1010" }} />
                </IconButton>

                {/* ================= LEFT – SLIDER ================= */}
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    pr: { xs: 0, md: 2 },
                    mb: { xs: 2, md: 0 },
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: { xs: 220, md: 490 },
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      style={{
                        display: "flex",
                        height: "100%",
                      }}
                      animate={{
                        x: `-${currentSlide * 100}%`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                    >
                      {viewProject.images.map((img: string) => {
                        const src = img

                        return (
                          <Box
                            key={img}
                            sx={{
                              minWidth: "100%",
                              height: "100%",
                              position: "relative",
                            }}
                          >
                            <img
                              src={src}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />

                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                bgcolor: "rgb(255, 18, 18)",
                              }}
                              onClick={() =>
                                handleDeleteImage(viewProject._id, img)
                              }
                            >
                              <DeleteIcon sx={{fontSize:20,color: "#fff" }} />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </motion.div>

                    {/* ARROWS */}
                    {viewProject.images.length > 1 && (
  <>
  
                    <IconButton
                      onClick={() =>
                        setCurrentSlide((p) =>
                          p === 0 ? viewProject.images.length - 1 : p - 1,
                        )
                      }
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 12,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <ArrowBackIosNewIcon sx={{ color: "#fff" }} />
                    </IconButton>

                    <IconButton
                      onClick={() =>
                        setCurrentSlide((p) =>
                          p === viewProject.images.length - 1 ? 0 : p + 1,
                        )
                      }
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 12,
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <ArrowForwardIosIcon sx={{ color: "#fff" }} />
                    </IconButton>
  </>
)}


                  </Box>
                </Box>
                {/* ================= RIGHT – PREMIUM DETAILS ================= */}
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    pl: { xs: 0, md: 6 },
                    pr: { xs: 0, md: 2 },
                    pb: { xs: 0, md: 7 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    color: "#fff",
                    maxHeight: 460,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#333",
                      borderRadius: 3,
                    },
                  }}
                >
                  {/* Title Section */}
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                      Project Title
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {viewProject.title}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "#333", my: 2 }} />

                  {/* Year Section */}
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                      Year
                    </Typography>
                    <Typography variant="body1" color="#fff">
                      {viewProject.year}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "#333", my: 2 }} />

                  {/* Description Section */}
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                      Description
                    </Typography>
                    <Typography color="#ccc" lineHeight={1.8}>
                      {viewProject.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "#333", my: 2 }} />

                  {/* Technologies Section */}
                  {viewProject.technologies.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="#aaa" mb={1}>
                        Technologies
                      </Typography>
                      <Stack direction="row" gap={1.5} flexWrap="wrap">
                        {viewProject.technologies.map((tech: string) => (
                          <Chip
                            key={tech}
                            label={tech}
                            sx={{
                              bgcolor: "#208af5",
                              color: "#fff",
                              border: "1px solid #333",
                              fontWeight: 500,
                              px: 2,
                              py: 0.5,
                              "&:hover": {
                                bgcolor: "#2e2e42",
                                transform: "scale(1.05)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Visit Button*/}
                  {viewProject.link && (
                    <Button
                      href={viewProject.link}
                      target="_blank"
                      variant="contained"
                      sx={{
                        mt: "auto",
                        alignSelf: "flex-start",
                        bgcolor: "linear-gradient(135deg, #6b5b95, #b8a9c9)",
                        color: "#fff",
                        mt: 2,
                        px: 4,
                        py: 1.2,
                        width: "100%",
                        "&:hover": {
                          bgcolor: "linear-gradient(135deg, #b8a9c9, #6b5b95)",
                        },
                      }}
                    >
                      Visit Project
                    </Button>
                  )}
                </Box>
              </DialogContent>
            )}
          </Dialog>

          {/* ===================== MODAL ===================== */}
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            fullWidth
            maxWidth="md"
            fullScreen={isSmallScreen}  
           PaperProps={{
            sx: {
              borderRadius: { xs: 0, md: 4 },  
              bgcolor: "#121212",
              backdropFilter: "blur(20px)",
              border: { md: `2px solid ${primaryBlue}` },
              boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
              m: { xs: 0 },  
                    },
                    }}
          >
            <DialogContent>
              <Stack spacing={3}>
                <Typography color="#fff" fontWeight={700}>
                  {editMode ? "Edit Project" : "Add Project"}
                </Typography>

                <TextField
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  fullWidth
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#1e1e1e",
                      borderRadius: 6,
                    },
                  }}
                />

                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#1e1e1e",
                      borderRadius: 6,
                    },
                  }}
                />

                <TextField
                  label="Year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  fullWidth
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#1e1e1e",
                      borderRadius: 6,
                    },
                  }}
                />

                <TextField
                  label="Project Link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  fullWidth
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#1e1e1e",
                      borderRadius: 6,
                    },
                  }}
                />

                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      label="Add Technology"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      fullWidth
                      InputLabelProps={{ style: { color: "#aaa" } }}
                      InputProps={{
                        style: {
                          color: "#fff",
                          backgroundColor: "#1e1e1e",
                          borderRadius: 6,
                        },
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && techInput.trim() !== "") {
                          e.preventDefault();
                          setTechnologies([...technologies, techInput.trim()]);
                          setTechInput("");
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (techInput.trim() !== "") {
                          setTechnologies([...technologies, techInput.trim()]);
                          setTechInput("");
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Stack>

                  <Stack direction="row" gap={1}  flexWrap="wrap">
                    {technologies.map((tech, idx) => (
                      <Chip
                        key={idx}
                        label={tech}
                        onDelete={() =>
                          setTechnologies(
                            technologies.filter((t) => t !== tech),
                          )
                        }
                        sx={{
                          fontSize: "0.9rem",
                          px: 1.5,
                          borderRadius: "10px",
                          bgcolor: "#1e1e2f",
                          color: "#fff",
                          border: `1px solid #333`,
                          "& .MuiChip-deleteIcon": { color: "#ff5555" },
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Card
                  sx={{
                    border: "2px dashed #333",
                    bgcolor: "#1a1a1a",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Button component="label" startIcon={<AddIcon />}>
                    Upload Images
                    <input
                      hidden
                      type="file"
                      multiple
                      onChange={(e) => handleImageSelect(e.target.files)}
                    />
                  </Button>
                </Card>

                {preview.length > 0 && (
                  <Grid container spacing={2}>
                    {preview.map((src, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            border:
                              mainImageIndex === idx
                                ? `3px solid ${primaryBlue}`
                                : "2px solid #333",
                          }}
                        >
                          <img
                            src={src}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: 110,
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              bgcolor: "rgba(0,0,0,0.6)",
                            }}
                            onClick={() => removePreviewImage(idx)}
                          >
                            <DeleteIcon sx={{ color: "#fff", fontSize: 16 }} />
                          </IconButton>
                          <Tooltip title="Set as main image">
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                bottom: 5,
                                right: 5,
                                bgcolor:
                                  mainImageIndex === idx
                                    ? primaryBlue
                                    : "rgba(0,0,0,0.6)",
                              }}
                              onClick={() => setMainImageIndex(idx)}
                            >
                              ⭐
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAddOrUpdate({ ...form, technologies })}
                  >
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
