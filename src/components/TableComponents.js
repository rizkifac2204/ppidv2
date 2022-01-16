// MUI
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// ICON
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import HelpIcon from "@mui/icons-material/Help";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

const ButtonDeleteSelected = ({ selectedItem, handleDeleteSelected }) => {
  return (
    <Button
      variant="text"
      size="small"
      startIcon={<DeleteIcon />}
      disabled={selectedItem.length === 0}
      onClick={handleDeleteSelected}
    >
      Hapus {selectedItem.length} Data Terpilih
    </Button>
  );
};

const CsvHelper = () => {
  return (
    <Button
      variant="text"
      size="small"
      startIcon={<HelpIcon />}
      onClick={() =>
        window.open("https://www.youtube.com/watch?v=n2IgdWefn1Q", "_blank")
      }
    >
      Bantuan CSV
    </Button>
  );
};

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <Grid container spacing={1}>
        <Grid item>
          <GridToolbarColumnsButton />
        </Grid>
        <Grid item>
          <GridToolbarFilterButton />
        </Grid>
        <Grid item>
          <GridToolbarDensitySelector />
        </Grid>
        <Grid item>
          <GridToolbarExport />
        </Grid>
        <Grid item>
          <CsvHelper />
        </Grid>
        <Grid item>
          <ButtonDeleteSelected
            selectedItem={props.selectedItem}
            handleDeleteSelected={props.handleDeleteSelected}
          />
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

export { CustomToolbar };
