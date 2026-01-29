  import React, { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { RootState, AppDispatch } from "../../store/store";
  import { uploadCv } from "../redux/profileSlice";
  import {Box,Typography,Button,Stack,Paper,Divider,} from "@mui/material";
  import CloudUploadIcon from "@mui/icons-material/CloudUpload";
  import DescriptionIcon from "@mui/icons-material/Description";
  import DownloadIcon from "@mui/icons-material/Download";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import { toast } from "react-toastify";

  export default function CvUploadModern() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading } = useSelector((state: RootState) => state.profile);
    const [file, setFile] = useState<File | null>(null);

    // HANDEL SELECT
    const handleSelect = (file: File | null) => {
      if (!file) return;
      setFile(file);
      toast.info("Resume selected");
    };

      // HANDEL UPLOAD
    const handleUpload = async () => {
      if (!file) return;

      const toastId = toast.loading("Uploading resume...");
      const formData = new FormData();
      formData.append("cv", file);

      try {
        await dispatch(uploadCv(formData)).unwrap();
        toast.update(toastId, {
          render: "Resume uploaded successfully",
          type: "success",
          autoClose: 2000, 
          isLoading: false,
        });
        setFile(null);
      } catch {
        toast.update(toastId, {
          render: "Upload failed",
          type: "error",
          isLoading: false,
        });
      }
    };

    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6, color: "#fff",p:5 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Box>
            <Typography fontSize={22} fontWeight={600}>
              Resume
            </Typography>
            <Typography fontSize={14} color="#8b8b8b">
              Step 2 of 4 · Complete your profile
            </Typography>
          </Box>

          {data?.cvUrl && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon sx={{ color: "#4caf50" }} />
              <Typography fontSize={14} color="#4caf50">
                Completed
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Upload Area */}
        <Paper
          sx={{
            p: 5,
            background: "#121212",
            border: "1px dashed #2e2e2e",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 42, color: "#bababa" }} />
          <Typography mt={2} fontWeight={500} color= "#bababa" >
            Upload your resume
          </Typography>
          <Typography fontSize={14} color="#777" mb={3}>
            PDF, DOC or DOCX · Max 5MB
          </Typography>

          <Button
            component="label"
            sx={{
              background: "#1e1e1e",
              border: "1px solid #2e2e2e",
              color: "#fff",
              textTransform: "none",
              px: 4,
              "&:hover": { background: "#2a2a2a" },
            }}
          >
            Choose file
            <input
              hidden
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleSelect(e.target.files?.[0] || null)}
            />
          </Button>

          {file && (
            <Button
              onClick={handleUpload}
              disabled={loading}
              sx={{
                ml: 2,
                background: "#fff",
                color: "#000",
                textTransform: "none",
                "&:hover": { background: "#e0e0e0" },
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </Paper>

        {/* Uploaded CV Card */}
        {data?.cvUrl && (
          <>
            <Divider sx={{ my: 5, borderColor: "#262626" }} />

            <Paper
              sx={{
                p: 3,
                background: "#161616",
                borderRadius: 3,
                border: "1px solid #262626",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <DescriptionIcon sx={{ color: "#9e9e9e" }} />
                <Box>
                  <Typography fontWeight={500}  color="#a5a5a5">Resume uploaded</Typography>
                  <Typography fontSize={13} color="#777">
                    Visible to recruiters
                  </Typography>
                </Box>

                <Button
                  href={data.cvUrl}
                  target="_blank"
                  startIcon={<DownloadIcon />}
                  sx={{
                    ml: "auto",
                    textTransform: "none",
                    color: "#b5b5b5",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Download
                </Button>
              </Stack>
            </Paper>

            {/* Preview */}
            {data.cvUrl.endsWith(".pdf") && (
              <Box
                sx={{
                  mt: 4,
                  height: "80vh",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #262626",
                  background: "#0d0d0d",
                }}
              >
                <iframe
                  src={data.cvUrl}
                  title="CV Preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }