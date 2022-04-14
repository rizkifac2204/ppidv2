import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

function ProfileCard({ profile, handleDelete }) {
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
              alt={profile.nama_admin || profile.name}
              src={profile.image ? profile.image : "."}
              sx={{ width: 160, height: 160 }}
            />
            <Typography variant="h5">{profile.level}</Typography>
          </Box>
          <Grid container wrap="wrap" sx={{ typography: "body2" }} spacing={1}>
            <Grid item xs={4}>
              Nama
            </Grid>
            <Grid item xs={8}>
              : {profile.nama_admin}
            </Grid>

            <Grid item xs={4}>
              Unit
            </Grid>
            <Grid item xs={8}>
              : {profile.nama_bawaslu}
            </Grid>

            <Grid item xs={4}>
              Telp
            </Grid>
            <Grid item xs={8}>
              : {profile.telp_admin}
            </Grid>

            <Grid item xs={4}>
              Email
            </Grid>
            <Grid item xs={8}>
              : {profile.email_admin}
            </Grid>

            <Grid item xs={4}>
              Alamat
            </Grid>
            <Grid item xs={8}>
              : {profile.alamat_admin}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          {handleDelete && Boolean(profile.editable) && (
            <Button size="small" color="secondary" onClick={handleDelete}>
              Hapus
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
}

export default ProfileCard;
