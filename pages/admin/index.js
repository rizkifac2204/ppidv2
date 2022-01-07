import { useState, useEffect } from "react";
import axios from "axios";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Collapse from "@mui/material/Collapse";
// ICON
import PeopleIcon from "@mui/icons-material/People";
import PanToolIcon from "@mui/icons-material/PanTool";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import WifiIcon from "@mui/icons-material/Wifi";
import SignalWifiBadIcon from "@mui/icons-material/SignalWifiBad";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Index() {
  const [main, setMain] = useState({});
  const [status, setStatus] = useState({});
  const [unresponse, setUnresponse] = useState({});

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    function getMain() {
      axios
        .get(`api/dashboard/main`)
        .then((res) => {
          setMain(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getStatus() {
      axios
        .get(`api/dashboard/status`)
        .then((res) => {
          setStatus(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getUnresponse() {
      axios
        .get(`api/dashboard/unresponse`)
        .then((res) => {
          setUnresponse(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // getMain();
    // getStatus();
    // getUnresponse();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <CardContent>
                <Typography component="div" variant="h5">
                  28
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Pengguna
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="Detail">
                  <SettingsSuggestIcon />
                </IconButton>
              </CardActions>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <PeopleIcon color="info" sx={{ fontSize: 120 }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <CardContent>
                <Typography component="div" variant="h5">
                  100
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Survey
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="Detail">
                  <SettingsSuggestIcon />
                </IconButton>
              </CardActions>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <DynamicFormIcon color="warning" sx={{ fontSize: 120 }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <CardContent>
                <Typography component="div" variant="h5">
                  10
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Keberatan
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="Detail">
                  <SettingsSuggestIcon />
                </IconButton>
              </CardActions>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <PanToolIcon color="error" sx={{ fontSize: 120 }} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <CardContent>
                <Typography component="div" variant="h5">
                  28
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Pemohonan Online
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="Detail">
                  <SettingsSuggestIcon />
                </IconButton>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <WifiIcon color="success" sx={{ fontSize: 120 }} />
            </Box>
          </Card>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep
                skillet over medium-high heat. Add chicken, shrimp and chorizo,
                and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves,
                garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a
                boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes
                and peppers, and cook without stirring, until most of the liquid
                is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
                reserved shrimp and mussels, tucking them down into the rice,
                and cook again without stirring, until mussels have opened and
                rice is just tender, 5 to 7 minutes more. (Discard any mussels
                that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then
                serve.
              </Typography>
            </CardContent>
          </Collapse>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <CardContent>
                <Typography component="div" variant="h5">
                  28
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Pemohonan Online
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="Detail">
                  <SettingsSuggestIcon />
                </IconButton>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              <SignalWifiBadIcon color="success" sx={{ fontSize: 120 }} />
            </Box>
          </Card>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron
                and set aside for 10 minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep
                skillet over medium-high heat. Add chicken, shrimp and chorizo,
                and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves,
                garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a
                boil.
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes
                and peppers, and cook without stirring, until most of the liquid
                is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
                reserved shrimp and mussels, tucking them down into the rice,
                and cook again without stirring, until mussels have opened and
                rice is just tender, 5 to 7 minutes more. (Discard any mussels
                that don’t open.)
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then
                serve.
              </Typography>
            </CardContent>
          </Collapse>
        </Grid>
      </Grid>

      {/* {JSON.stringify(Object.keys(main).length)} = {JSON.stringify(main)}
      {JSON.stringify(Object.keys(status).length)} = {JSON.stringify(status)}
      {JSON.stringify(Object.keys(unresponse).length)} ={" "}
      {JSON.stringify(unresponse)} */}
    </>
  );
}

Index.auth = true;
export default Index;
