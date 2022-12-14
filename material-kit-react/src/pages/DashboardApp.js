import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Input,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { DashboardListHead, DashboardListToolbar, DashboardMoreMenu } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'userName', label: 'Ad', alignRight: "center" },
  { id: 'productAmount', label: 'Məhsulun qiyməti', alignRight: "center" },
  { id: 'paymentAmount', label: 'Ödəniş məbləği', alignRight: "center" },
  { id: 'paymentDate', label: 'Ödəniş tarixi', alignRight: "center" },
  { id: 'debt', label: 'Borc', alignRight: "center" },
  { id: '' },
];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.userName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

//--------------------------------------------------------------

export default function DashboardApp() {

  const [list, setList] = useState([]);

  const getAllModels = async () => {
    const response = await fetch('https://localhost:7005/Payment/dashboard');
    response.json().then((res) => setList(res));
  };

  useEffect(() => {
    getAllModels();
  }, []);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

  const filteredUsers = applySortFilter(list, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Dashboard">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            İstifadəçilərin son ödənişləri və qalıq borcları
          </Typography>

        </Stack>

        <Card>
          <DashboardListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DashboardListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={list.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}

                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, userName, productAmount, paymentAmount, paymentDate, debt } = row;
                    const isItemSelected = selected.indexOf(userName) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >

                        <TableCell align="center">{userName}</TableCell>
                        <TableCell align="center">{productAmount}</TableCell>
                        <TableCell align="center">{paymentAmount}</TableCell>
                        <TableCell align="center">{paymentDate}</TableCell>
                        <TableCell align="center">{debt}</TableCell>

                      </TableRow>

                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </Card>
      </Container>
    </Page>
  );
}

