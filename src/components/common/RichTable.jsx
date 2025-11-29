import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TableSortLabel, Box, Typography, TextField, Checkbox, IconButton, Chip,
  Menu, MenuItem, Button, Tooltip, Collapse, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

// Utils de Ordenação
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const RichTable = ({ 
  title, 
  data = [], 
  columns = [], 
  actions, 
  selectable = false,
  onRowClick,
  onBulkDelete 
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para exportação
  const [anchorElExport, setAnchorElExport] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (!selectable) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const filteredData = useMemo(() => {
    return data.filter(row => 
      columns.some(col => {
        const val = row[col.id];
        return val && String(val).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  const sortedData = useMemo(() => stableSort(filteredData, getComparator(order, orderBy)), [filteredData, order, orderBy]);
  const visibleRows = useMemo(() => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedData, page, rowsPerPage]);

  const handleExportClick = (event) => setAnchorElExport(event.currentTarget);
  const handleExportClose = () => setAnchorElExport(null);

  const exportData = (type) => {
    const dataToExport = selected.length > 0 
      ? data.filter(row => selected.includes(row.id)) 
      : filteredData;

    if (type === 'excel') exportToExcel(dataToExport, title);
    if (type === 'pdf') exportToPDF(title, columns, dataToExport, title);
    
    handleExportClose();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'background.paper' }}>
        
        {/* Toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            {selected.length > 0 && (
              <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                {selected.length} item(s) selecionado(s)
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {selected.length > 0 && onBulkDelete && (
              <Tooltip title="Deletar Selecionados">
                <IconButton color="error" onClick={() => onBulkDelete(selected)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            <TextField
              size="small"
              placeholder="Buscar..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" /> }}
              sx={{ minWidth: 200 }}
            />
            
            <Tooltip title="Filtros">
              <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? "primary" : "default"}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar">
              <IconButton onClick={handleExportClick}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorElExport} open={Boolean(anchorElExport)} onClose={handleExportClose}>
              <MenuItem onClick={() => exportData('excel')}>Exportar Excel</MenuItem>
              <MenuItem onClick={() => exportData('pdf')}>Exportar PDF</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Área de Filtros Expansível (Exemplo de Filtro Avançado) */}
        <Collapse in={showFilters}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default', borderStyle: 'dashed' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Filtros Avançados</Typography>
            <Grid container spacing={2}>
               {/* Aqui você pode mapear colunas para inputs específicos */}
               <Grid item xs={12}><Typography variant="caption" color="text.secondary">Filtros específicos podem ser implementados aqui.</Typography></Grid>
            </Grid>
          </Paper>
        </Collapse>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < data.length}
                      checked={data.length > 0 && selected.length === data.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
                {columns.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '2px solid rgba(255,255,255,0.1)' }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {actions && <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.indexOf(row.id) !== -1;
                return (
                  <TableRow
                    hover
                    onClick={(event) => { handleClick(event, row.id); onRowClick && onRowClick(row); }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ 
                        cursor: 'pointer',
                        '&.Mui-selected': { backgroundColor: 'rgba(0, 229, 255, 0.08) !important' },
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03) !important' }
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                    )}
                    {columns.map(col => (
                      <TableCell key={`${row.id}-${col.id}`} align={col.numeric ? 'right' : 'left'}>
                        {col.render ? col.render(row) : row[col.id]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {visibleRows.length === 0 && (
                <TableRow><TableCell colSpan={100} align="center" sx={{ py: 6, color: 'text.secondary' }}>Nenhum dado encontrado</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>
    </Box>
  );
};

export default RichTable;