// ProjectsSliderPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchProjects } from "../redux/projectsSlice";
import {Box,Typography,IconButton,Dialog,DialogContent,useTheme,Stack,Button,Grid,Divider, useMediaQuery,} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { blue } from "@mui/material/colors";

const BASE_URL = "https://node-hr.vercel.app";

export default function ProjectsSliderPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector(
    (state: RootState) => state.projects,
  );
  const [viewProject, setViewProject] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const primaryBlue = theme.palette.primary.main;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ p: {xs:.1,md:3} }}>
      {loading && <Typography color="#aaa">Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Projects Slider */}
      <Box sx={{ position: "relative" }}>
        {/* زرار شمال */}
        {list.length > 1 && (
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              bgcolor: "rgb(31, 120, 253)",
              zIndex: 10,
            }}
          >
            <ArrowBackIosNewIcon sx={{ color: "#fff" }} />
          </IconButton>
        )}

        {/* زرار يمين */}
        {list.length > 1 && (
          <IconButton
            onClick={scrollRight}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              bgcolor: "rgb(31, 120, 253)",
              zIndex: 10,
            }}
          >
            <ArrowForwardIosIcon sx={{ color: "#fff" }} />
          </IconButton>
        )}

        {/* الـ Slider نفسه */}
        <Box
          ref={sliderRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            scrollSnapType: "x mandatory",
            pb: 2,
          }}
        >
          {list.map((proj: any) => {
            const mainIdx = proj.mainImageIndex || 0;
            const mainImage = proj.images?.[mainIdx]?.startsWith("http")
              ? proj.images[mainIdx]
              : `${BASE_URL}${proj.images[mainIdx]}`;
            return (
              <Box
                key={proj._id}
                sx={{
                  minWidth: { xs: "80%", sm: "60%", md: "45%" },
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  scrollSnapAlign: "center",
                  cursor: "pointer",
                  "&:hover .overlay": { opacity: 1 },
                }}
              >
                <img
                  src={mainImage}
                  alt={proj.title}
                  style={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "12px",
                  }}
                />

                {/* Overlay */}
                <Box
                  onClick={() => {
                    setViewProject(proj);
                    setCurrentSlide(0);
                  }}
                  className="overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "0.3s",
                    borderRadius: "12px",
                  }}
                >
                  <IconButton
                    sx={{ color: "#fff", fontSize: 24 }}
                    onClick={() => {
                      setViewProject(proj);
                      setCurrentSlide(0);
                    }}
                  >
                    👁
                  </IconButton>
                </Box>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {proj.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* View Project Modal */}
      <Dialog
        open={Boolean(viewProject)}
        onClose={() => setViewProject(null)}
        maxWidth="2lg"
        fullWidth
        fullScreen={isSmallScreen}  
         PaperProps={{
                      component: motion.div,
                      initial: { opacity: 0, y: -30 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -30 },
                      transition: { duration: 0.3 },
                      sx: {
                      borderRadius: { xs: 0, md: 4 },  
                      bgcolor: "#121212",
                      border: { md: `2px solid ${primaryBlue}` },
                      backdropFilter: "blur(20px)",
                       boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
                      m: { xs: 0 },  
 
                    },
                    }}
      >
        {viewProject && (
          <DialogContent
            sx={{
              bgcolor: "#1b1b1b",
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              position: "relative",
            }}
          >
            {/* Close Icon */}
            <IconButton
              onClick={() => setViewProject(null)}
              sx={{
                zIndex: 100,
                position: "absolute",
                top: { xs: 20, md: 12 },
                right: { xs: 20, md: 12 },
                bgcolor: "rgba(255, 255, 255, 0.95)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.8)" },
              }}
            >
              <CloseIcon sx={{ color: "#000000" }} />
            </IconButton>

            {/* Slider */}
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 220, md: 460 },
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    display: "flex",
                    height: "100%",
                  }}
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  {viewProject.images.map((img: string, idx: number) => {
                    const src = img.startsWith("http")
                      ? img
                      : `${BASE_URL}${img}`;
                    return (
                      <Box key={idx} sx={{ minWidth: "100%", height: "100%" }}>
                        <img
                          src={src}
                          alt={viewProject.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                      </Box>
                    );
                  })}
                </motion.div>

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

            {/* Details */}
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                pl: { md: 6 },
                pb: { md: 2 },
                mt: { xs: 2, md: 0 },
                color: "#fff",
                overflowY: "auto",
                maxHeight: 460,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",  
              }}
            >
              <Stack
                spacing={3}
                flexGrow={1}
                divider={<Divider sx={{ borderColor: "#333" }} />}
              >
                {/* Title Section */}
                <Box>
                  <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                    Title
                  </Typography>
                  <Typography variant="h4" sx={{fontSize:{xs:16,md:23}}} fontWeight={700}>
                    {viewProject.title}
                  </Typography>
                </Box>

                {/* Year Section */}
                <Box>
                  <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                    Year
                  </Typography>
                  <Typography variant="body1" color="#fff">
                    {viewProject.year}
                  </Typography>
                </Box>

                {/* Description Section */}
                <Box>
                  <Typography variant="subtitle2" color="#aaa" mb={0.5}>
                    Description
                  </Typography>
                  <Typography color="#ccc" lineHeight={1.6}>
                    {viewProject.description}
                  </Typography>
                </Box>

                {/* Technologies Section */}
                {viewProject.technologies?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="#aaa" mb={1}>
                      Technologies
                    </Typography>
                    <Grid container spacing={1.5}>
                      {viewProject.technologies.map(
                        (tech: string, idx: number) => (
                          <Grid item xs={6} md="auto" key={idx}>
                            <Box
                              sx={{
                                px: 2,
                                py: 0.5,
                                bgcolor: "#1976d2",
                                border: "1px solid #333",
                                borderRadius: 2,
                                color: "#fff",
                                fontWeight: 500,
                                textAlign: "center",
                              }}
                            >
                              {tech}
                            </Box>
                          </Grid>
                        ),
                      )}
                    </Grid>
                  </Box>
                )}
              </Stack>

              {/* Visit Button  */}
              {viewProject.link && (
                <Box mt={3}>
                  <Button
                    variant="contained"
                    href={viewProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      background: "#1976d2",
                    }}
                  >
                    Visit Project
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
