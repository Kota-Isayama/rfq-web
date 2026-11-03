import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { useListRfqsRfqGetQuery } from "../app/api/generatedApi";
import { usePricingUpdates } from "../features/pricing/usePricingUpdates";


export const RfqListPage = () => {
  const {
    data,
    isLoading,
    error,
  } = useListRfqsRfqGetQuery();

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const rfqs = data?.rfqs ?? [];

  const filteredRfqs = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return rfqs;
    }

    return rfqs.filter((rfq) =>
      rfq.rfq_id
        .toLowerCase()
        .includes(keyword),
    );
  }, [rfqs, searchText]);

  const requestIds = useMemo(
    () =>
      filteredRfqs.map(
        (rfq) => rfq.rfq_id,
      ),
    [filteredRfqs],
  );

  const {
    prices,
    connectionState,
  } = usePricingUpdates(requestIds);

  if (isLoading) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: 4 }}
      >
        <Alert severity="error">
          Failed to load RFQs.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >
      <Stack spacing={2}>
        <Stack
            direction="row"
            sx={{
                justifyContent:
                "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="h4">
                RFQs
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                alignItems: "center",
                }}
            >
                <Chip
                label={`Pricing: ${connectionState}`}
                color={
                    connectionState ===
                    "connected"
                    ? "success"
                    : connectionState ===
                        "error"
                        ? "error"
                        : "default"
                }
                variant="outlined"
                />

                <Button
                    variant="contained"
                    onClick={() =>
                        navigate("/rfqs/new")
                    }
                >
                    New RFQ
                </Button>
            </Stack>
        </Stack>

        <TextField
          label="Search RFQ"
          placeholder="RFQ ID"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
          size="small"
          fullWidth
        />

        <TableContainer
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  RFQ ID
                </TableCell>

                <TableCell align="right">
                  Notional
                </TableCell>

                <TableCell>
                  Currency
                </TableCell>

                <TableCell>
                  Fixed Leg
                </TableCell>

                <TableCell>
                  Effective Date
                </TableCell>

                <TableCell>
                  Maturity Date
                </TableCell>

                <TableCell align="right">
                  Par Rate
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRfqs.map((rfq) => {
                const price =
                  prices[rfq.rfq_id];

                return (
                    <TableRow
                        key={rfq.rfq_id}
                        hover
                        onClick={() =>
                            navigate(`/rfqs/${rfq.rfq_id}`)
                        }
                        sx={{
                            cursor: "pointer",
                        }}
                    >
                    <TableCell>
                      {rfq.rfq_id}
                    </TableCell>

                    <TableCell align="right">
                      {rfq.notional}
                    </TableCell>

                    <TableCell>
                      {rfq.currency}
                    </TableCell>

                    <TableCell>
                      {rfq.fixed_leg}
                    </TableCell>

                    <TableCell>
                      {rfq.effective_date}
                    </TableCell>

                    <TableCell>
                      {rfq.maturity_date}
                    </TableCell>

                    <TableCell align="right">
                      {price?.par_rate ?? "-"}
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredRfqs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No RFQs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

