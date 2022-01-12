import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
} from "@mui/material";

function ProfileCard({ profile }) {
  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            <Avatar
              alt={profile.nama || profile.name}
              src={profile.image ? profile.image : "."}
              sx={{ width: 160, height: 160 }}
            />
            <Typography variant="h5">{profile.nama_level}</Typography>
          </Box>
          <Grid container wrap="wrap" sx={{ typography: "body2" }} spacing={1}>
            <Grid item xs={4}>
              Nama
            </Grid>
            <Grid item xs={8}>
              : {profile.nama}
            </Grid>

            <Grid item xs={4}>
              Unit
            </Grid>
            <Grid item xs={8}>
              : {profile.provinsi} {profile.kabupaten} Bawaslu RI
            </Grid>

            <Grid item xs={4}>
              Telp
            </Grid>
            <Grid item xs={8}>
              : {profile.telp}
            </Grid>

            <Grid item xs={4}>
              Email
            </Grid>
            <Grid item xs={8}>
              : {profile.email}
            </Grid>

            <Grid item xs={4}>
              ALamat
            </Grid>
            <Grid item xs={8}>
              : {profile.alamat}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default ProfileCard;
