import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {Box,Typography,Avatar,Chip,Grid,Stack,TextField,Button,Dialog,DialogTitle,DialogContent,DialogActions,Accordion,AccordionSummary,AccordionDetails,Link,useMediaQuery,useTheme,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchProfile, updateProfile } from "../redux/profileSlice";
import ProjectsPage from "./showProject";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import BrushIcon from "@mui/icons-material/Brush";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import TwitterIcon from "@mui/icons-material/Twitter";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { Snackbar, Alert } from "@mui/material";
import Loading from "../loading";
import { motion } from "framer-motion";
import { Preview } from "@mui/icons-material";
import { useParams } from "react-router-dom";

// BASE COLOE
const BASE_URL = "https://node-hr.vercel.app";
const primaryBlue = "#3B82F6";
const textPrimary = "#E5E7EB";
const textSecondary = "#9CA3AF";
const cardBg = "#181818ff";

// CARD COLOR
const darkCard = {
  p: 1,
  borderRadius: 3,
  border: "1px solid #1E1E2F",
  bgcolor: cardBg,
  boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
};

// ICONS
const socialChip = {
  bgcolor: "#1E293B",
  color: textPrimary,
  border: "1px solid #334155",
  "& .MuiChip-icon": { color: primaryBlue },
  "&:hover": {
    bgcolor: "#0F172A",
    borderColor: primaryBlue,
  },
};

const SectionAccordion = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Accordion
    sx={{
      mb: 2,
      bgcolor: cardBg,
      borderRadius: 3,
      border: "1px solid #1E1E2F",
      "&:before": { display: "none" },
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: textPrimary }} />}
    >
      <Typography fontWeight={600} color={textPrimary}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export default function Overview({ isPublic = false }: { isPublic?: boolean }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const primaryBlue = theme.palette.primary.main;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
const { id } = useParams();
  // SHARE
  const handleShare = async () => {
    if (!data?.id) return console.error("Profile ID not found");
    const link = `${window.location.origin}/seeker/overview/${data.id}`;
    setShareLink(link);
    try {
      await navigator.clipboard.writeText(link);
      setOpenSnackbar(true);
    } catch (err) {
      setOpenDialog(true);
    }
  };

  // STYE INPUT
  const inputStyle = {
    "& .MuiInputBase-input": {
      color: "#FFF",
    },
    "& .MuiInputLabel-root": {
      color: "#B0B0B0",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#444",
      },
      "&:hover fieldset": {
        borderColor: "#666",
      },
      "&.Mui-focused fieldset": {
        borderColor: primaryBlue,
        borderWidth: 2,
      },
    },
  };
 useEffect(() => {
    if (isPublic && id) {
       dispatch(fetchProfile(id));
    } else {
       dispatch(fetchProfile());
    }
  }, [dispatch, isPublic, id]);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  // SAVE
  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", form.name || "");
    formData.append("bio", form.bio || "");
    formData.append("phone", form.phone || "");
    formData.append("address", form.address || "");
    formData.append("position", form.position || "");
    if (form.github) formData.append("github", form.github|| "");
    if (form.linkedin) formData.append("linkedin", form.linkedin|| "");
    if (form.portfolio) formData.append("portfolio", form.portfolio|| "");
    if (form.behance) formData.append("behance", form.behance|| "");
    if (form.dribbble) formData.append("dribbble", form.dribbble|| "");
    if (form.twitter) formData.append("twitter", form.twitter|| "");
    if (avatarFile) formData.append("avatar", avatarFile|| "");

    dispatch(updateProfile(formData));
    setOpen(false);
  };

  if (loading) return <Loading></Loading>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  return (
    <Box sx={{ p: { xs: 0, md: 4 }, mt: 9 }}>
      {/* ================= Header ================= */}
      <Box sx={{ ...darkCard, mb: 4 }}>
        <Grid
          container
          spacing={3}
          alignItems={{ xs: "center", md: "flex-start" }}
          justifyContent={{ xs: "center", md: "flex-start" }}
        >
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={data.avatar || undefined}
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${primaryBlue}`,
                boxShadow: `0 0 20px ${primaryBlue}55`,
              }}
            />
          </Grid>

          {/* Info */}
          <Grid
            sx={{ textAlign: { xs: "center", md: "left" } }}
            item
            xs={12}
            md
          >
            <Typography variant="h5" fontWeight={700} color={textPrimary}>
              {data.name}
            </Typography>

            <Typography
              color={primaryBlue}
              fontWeight={500}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              {data.position}
            </Typography>

            {/* Contact */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems={{ xs: "center", md: "flex-start" }}
              flexWrap="wrap"
            >
              {data.email && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EmailIcon sx={{ fontSize: 16, color: textSecondary }} />
                  <Typography variant="body2" color={textSecondary}>
                    {data.email}
                  </Typography>
                </Stack>
              )}

              {data.phone && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16, color: textSecondary }} />
                  <Typography variant="body2" color={textSecondary}>
                    {data.phone}
                  </Typography>
                </Stack>
              )}

              {data.address && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocationOnIcon sx={{ fontSize: 16, color: textSecondary }} />
                  <Typography variant="body2" color={textSecondary}>
                    {data.address}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Social Links */}
            <Stack
              direction="row"
              gap={1}
              mt={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
              flexWrap="wrap"
            >
              {data.github && (
                <Chip
                  icon={<GitHubIcon />}
                  label="GitHub"
                  component="a"
                  href={data.github}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
              {data.linkedin && (
                <Chip
                  icon={<LinkedInIcon />}
                  label="LinkedIn"
                  component="a"
                  href={data.linkedin}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
              {data.portfolio && (
                <Chip
                  icon={<LanguageIcon />}
                  label="Portfolio"
                  component="a"
                  href={data.portfolio}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
              {data.behance && (
                <Chip
                  icon={<BrushIcon />}
                  label="Behance"
                  component="a"
                  href={data.behance}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
              {data.dribbble && (
                <Chip
                  icon={<SportsBasketballIcon />}
                  label="Dribbble"
                  component="a"
                  href={data.dribbble}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
              {data.twitter && (
                <Chip
                  icon={<TwitterIcon />}
                  label="Twitter"
                  component="a"
                  href={data.twitter}
                  target="_blank"
                  clickable
                  sx={socialChip}
                />
              )}
            </Stack>
          </Grid>

          {!isPublic && (
            <>
              {/* Edit & Share Buttons */}
              <Grid sx={{ ml: "auto" }} item>
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{
                      fontSize: { xs: 11, md: 14 },
                      bgcolor: primaryBlue,
                      "&:hover": { bgcolor: "#2563EB" },
                    }}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    startIcon={<ShareIcon />}
                    variant="outlined"
                    onClick={handleShare}
                    sx={{
                      color: primaryBlue,
                      fontSize: { xs: 11, md: 14 },
                      borderColor: primaryBlue,
                      "&:hover": { borderColor: "#2563EB", bgcolor: "#1E293B" },
                    }}
                  >
                    Share Profile
                  </Button>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* ================= BIO ================= */}
      <SectionAccordion title="Bio">
        <Typography color={"#9CA3AF"}>
          {data.bio || "No bio available"}
        </Typography>
      </SectionAccordion>

      {/* ================= Skills ================= */}
      <SectionAccordion title="Skills">
        <Stack direction="row" gap={2} flexWrap="wrap">
          {data.skills?.map((s: string, index: number) => (
            <Chip
              key={`${s}-${index}`}
              label={s}
              sx={{
                bgcolor: "#0c4fdeff",
                color: textPrimary,
              }}
            />
          ))}
        </Stack>
      </SectionAccordion>

      {/* ================= Education ================= */}
      <SectionAccordion title="Education">
        <Box sx={{ position: "relative", pl: { xs: 0, md: 6 } }}>
          {/* Vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: "#2A2A3D",
              borderRadius: 1,
            }}
          />

          <Stack spacing={4}>
            {data.education?.map((edu: any) => (
              <Box key={edu._id} position="relative">
                {/* Timeline Dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: -4,
                    top: 0,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: primaryBlue,
                    boxShadow: `0 0 10px ${primaryBlue}`,
                    border: `2px solid ${primaryBlue}`,
                  }}
                />

                {/* Card */}
                <Box
                  sx={{
                    py: 2.5,
                    pl: { xs: 1, md: 3 },
                    borderRadius: 3,
                    bgcolor: "#1E1E2F",
                    border: "1px solid #1E1E2F",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                    transition: "0.3s",
                    "&:hover": {
                      border: `1px solid ${primaryBlue}`,
                      boxShadow: "0 14px 32px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  {/* Degree */}
                  <Typography
                    fontWeight={700}
                    fontSize={{ xs: 14, md: 17 }}
                    color={textPrimary}
                  >
                    {edu.degree}
                  </Typography>

                  {/* School */}
                  <Typography
                    fontSize={{ xs: 13, md: 15 }}
                    color={textSecondary}
                    sx={{ mt: 0.3 }}
                  >
                    {edu.school}
                  </Typography>

                  {/* Date */}
                  <Typography
                    fontSize={{ xs: 13, md: 14 }}
                    color="#A1A1AA"
                    sx={{ mt: 0.5 }}
                  >
                    {edu.startDate?.slice(0, 4)} –{" "}
                    {edu.endDate ? edu.endDate.slice(0, 4) : edu.graduationYear}
                  </Typography>

                  {/* Description */}
                  {edu.description && (
                    <Typography
                      fontSize={{ xs: 13, md: 14 }}
                      color="#D1D5DB"
                      sx={{ mt: 1 }}
                    >
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </SectionAccordion>

      {/* ================= Experience ================= */}
      <SectionAccordion title="Experience">
        <Box sx={{ position: "relative", pl: { xs: 1, md: 6 } }}>
          {/* Vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: "#2A2A3D",
              borderRadius: 1,
            }}
          />

          <Stack spacing={4}>
            {data.experience?.map((exp: any) => (
              <Box key={exp._id} position="relative">
                {/* Timeline Dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: -4,
                    top: 0,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: primaryBlue,
                    boxShadow: `0 0 10px ${primaryBlue}`,
                    border: `2px solid ${primaryBlue}`,
                  }}
                />

                {/* Card */}
                <Box
                  sx={{
                    py: 2.5,
                    pl: { xs: 1, md: 3 },
                    borderRadius: 3,
                    bgcolor: "#1E1E2F",
                    border: "1px solid #1E1E2F",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                    transition: "0.3s",
                    "&:hover": {
                      border: `1px solid ${primaryBlue}`,
                      boxShadow: "0 14px 32px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  {/* Company + Position */}
                  <Typography
                    fontWeight={700}
                    fontSize={{ xs: 14, md: 17 }}
                    color={textPrimary}
                  >
                    {exp.position}
                  </Typography>

                  <Typography
                    fontSize={{ xs: 13, md: 15 }}
                    color={textSecondary}
                    sx={{ mt: 0.3 }}
                  >
                    {exp.company}
                  </Typography>

                  {/* Date */}
                  <Typography
                    fontSize={{ xs: 13, md: 14 }}
                    color="#A1A1AA"
                    sx={{ mt: 0.5 }}
                  >
                    {exp.startDate?.slice(0, 4)} –{" "}
                    {exp.endDate ? exp.endDate.slice(0, 4) : "Present"}
                  </Typography>

                  {/* Description */}
                  {exp.description && (
                    <Typography
                      fontSize={{ xs: 13, md: 14 }}
                      color="#D1D5DB"
                      sx={{ mt: 1 }}
                    >
                      {exp.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>

          {data.experience?.length === 0 && (
            <Typography color={textSecondary} sx={{ mt: 2 }}>
              No experience added yet
            </Typography>
          )}
        </Box>
      </SectionAccordion>

      {/* ================= Projects ================= */}
      <SectionAccordion title="Projects">
        <ProjectsPage></ProjectsPage>
      </SectionAccordion>

      {/* ================= CV ================= */}
      <SectionAccordion title="Curriculum Vitae">
        {data.cvUrl ? (
          <Button href={data.cvUrl} target="_blank" variant="contained">
            View / Download CV
          </Button>
        ) : (
          <Typography color={textSecondary}>No CV uploaded</Typography>
        )}
      </SectionAccordion>

      {/* EDITE PROFILE */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
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
            backdropFilter: "blur(20px)",
            pb: 4,
            border: { md: `2px solid ${primaryBlue}` },
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            m: { xs: 0 },
            width: { xs: "100%", md: "60%" },
            height: { xs: "100%", md: "auto" },
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 1, md: 4 } }}>
          <Stack spacing={4}>
            {/* ===== Header ===== */}
            <Typography
              variant="h6"
              fontWeight={700}
              color="#FFF"
              textAlign="center"
            >
              Edit Profile
            </Typography>

            {/* ===== Avatar ===== */}
            <Box display="flex" justifyContent="center">
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${primaryBlue}`,
                  boxShadow: `0 0 18px ${primaryBlue}55`,
                  position: "relative",
                }}
              >
                <img
                  src={data?.avatar || undefined}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Button
                  component="label"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "#00000088",
                    color: "#FFF",
                    opacity: 0,
                    transition: "0.3s",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Change
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
              </Box>
            </Box>

            {/* ===== Basic Info Section ===== */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "#191919",
                border: "1px solid #333",
              }}
            >
              <Typography color="#ccc" fontWeight={600} mb={1.5}>
                Basic Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  sx={inputStyle}
                  label="Name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                  sx={inputStyle}
                  label="Position"
                  value={form.position || ""}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                />
                <TextField
                  sx={inputStyle}
                  label="Bio"
                  multiline
                  rows={3}
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </Stack>
            </Box>

            {/* ===== Contact Section ===== */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "#191919",
                border: "1px solid #333",
              }}
            >
              <Typography color="#ccc" fontWeight={600} mb={1.5}>
                Contact
              </Typography>
              <Stack spacing={2}>
                <TextField
                  sx={inputStyle}
                  label="Email"
                  value={form.email || ""}
                  disabled
                />
                <TextField
                  sx={inputStyle}
                  label="Phone"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <TextField
                  sx={inputStyle}
                  label="Address"
                  value={form.address || ""}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </Stack>
            </Box>

            {/* ===== Social Links Section ===== */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "#191919",
                border: "1px solid #333",
              }}
            >
              <Typography color="#ccc" fontWeight={600} mb={1.5}>
                Social Links
              </Typography>
              <Stack spacing={2}>
                <TextField
                  sx={inputStyle}
                  label="GitHub"
                  value={form.github || ""}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
                <TextField
                  sx={inputStyle}
                  label="LinkedIn"
                  value={form.linkedin || ""}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
                <TextField
                  sx={inputStyle}
                  label="Portfolio"
                  value={form.portfolio || ""}
                  onChange={(e) =>
                    setForm({ ...form, portfolio: e.target.value })
                  }
                />
                <TextField
                  sx={inputStyle}
                  label="Behance"
                  value={form.behance || ""}
                  onChange={(e) =>
                    setForm({ ...form, behance: e.target.value })
                  }
                />
                <TextField
                  sx={inputStyle}
                  label="Dribbble"
                  value={form.dribbble || ""}
                  onChange={(e) =>
                    setForm({ ...form, dribbble: e.target.value })
                  }
                />
                <TextField
                  sx={inputStyle}
                  label="Twitter"
                  value={form.twitter || ""}
                  onChange={(e) =>
                    setForm({ ...form, twitter: e.target.value })
                  }
                />
              </Stack>
            </Box>

            {/* ===== Fixed Actions ===== */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: -20,
                width: "100%",
                borderTop: "1px solid #333",
                bgcolor: "#121212",
                py: 2,
                px: 0,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                zIndex: 100,
              }}
            >
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
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          icon={true}
          sx={{
            bgcolor: "#22c55ea7",
            color: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            width: "100%",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          Profile link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
