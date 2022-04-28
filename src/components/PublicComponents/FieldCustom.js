import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiPaper-root": {
      borderRadius: "100px",
      boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75);",
    },
  },
  list: {
    maxHeight: 300,
  },
}));

const TextFieldCustom = (props) => {
  return (
    <TextField
      fullWidth
      required
      margin="normal"
      variant="standard"
      inputProps={{ style: { fontSize: 14 } }}
      InputLabelProps={{ style: { fontSize: 14 } }}
      {...props}
    />
  );
};

const FormControlCustom = (props) => {
  return <FormControl fullWidth sx={{ mt: 2.5 }} {...props} />;
};

const InputLabelCustom = (props) => {
  return <InputLabel style={{ fontSize: 14, marginLeft: -15 }} {...props} />;
};

const FormLabelCustom = (props) => {
  return <FormLabel style={{ fontSize: 14 }} {...props} />;
};

const SelectCustom = (props) => {
  const classes = useStyles();
  return (
    <Select
      MenuProps={{ classes: { list: classes.list } }}
      required
      sx={{ fontSize: 14 }}
      variant="standard"
      {...props}
    />
  );
};

const MenuItemCustom = (props) => {
  return <MenuItem style={{ fontSize: 14 }} {...props} />;
};

const FormControlLabelRadioCustom = (props) => {
  return <FormControlLabel control={<Radio required={true} />} {...props} />;
};

const TextRadioCustom = (props) => {
  return <p style={{ fontSize: 14, color: "grey" }}>{props.text}</p>;
};

const CheckBoxCustom = (props) => {
  return (
    <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 18 } }} {...props} />
  );
};

const CheckBoxTex = ({ text }) => {
  return <p style={{ fontSize: 14, color: "grey" }}>{text}</p>;
};

export {
  TextFieldCustom,
  FormControlCustom,
  InputLabelCustom,
  FormLabelCustom,
  SelectCustom,
  MenuItemCustom,
  FormControlLabelRadioCustom,
  TextRadioCustom,
  CheckBoxCustom,
  CheckBoxTex,
};
