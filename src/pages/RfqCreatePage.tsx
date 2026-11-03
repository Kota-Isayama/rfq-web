import {
  Alert,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type PayReceive,
  useCreateRfqRfqPostMutation,
} from "../app/api/generatedApi";

export const RfqCreatePage = () => {
  const navigate = useNavigate();

  const [notional, setNotional] =
    useState("");

  const [
    effectiveDate,
    setEffectiveDate,
  ] = useState("");

  const [
    maturityDate,
    setMaturityDate,
  ] = useState("");

  const [
    fixedLeg,
    setFixedLeg,
  ] = useState<PayReceive>("pay");

  const [
    createRfq,
    {
      isLoading,
      error,
    },
  ] =
    useCreateRfqRfqPostMutation();

  const handleSubmit = async () => {
    const response = await createRfq({
      createSwapRfqRequest: {
        notional,
        effective_date:
          effectiveDate,
        maturity_date:
          maturityDate,
        fixed_leg:
          fixedLeg,
        currency: "JPY",
        assigned_trader: "Kota",
        registered_by: "someone",
      },
    }).unwrap();

    navigate(
      `/rfqs/${response.rfq_id}`,
    );
  };

  const canSubmit =
    notional.trim() !== "" &&
    effectiveDate !== "" &&
    maturityDate !== "";

  return (
    <Container
      maxWidth="sm"
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
            New RFQ
          </Typography>

          <Button
            variant="text"
            onClick={() =>
              navigate("/rfqs")
            }
          >
            Back to RFQs
          </Button>
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error">
                Failed to create RFQ.
              </Alert>
            )}

            <TextField
              label="Notional"
              value={notional}
              onChange={(event) =>
                setNotional(
                  event.target.value,
                )
              }
              placeholder="100000000"
              fullWidth
            />

            <TextField
              label="Currency"
              value="JPY"
              disabled
              fullWidth
            />

            <TextField
              label="Fixed Leg"
              select
              value={fixedLeg}
              onChange={(event) =>
                setFixedLeg(
                  event.target
                    .value as PayReceive,
                )
              }
              fullWidth
            >
              <MenuItem value="pay">
                Pay
              </MenuItem>

              <MenuItem value="receive">
                Receive
              </MenuItem>
            </TextField>

            <TextField
              label="Effective Date"
              type="date"
              value={effectiveDate}
              onChange={(event) =>
                setEffectiveDate(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
            />

            <TextField
              label="Maturity Date"
              type="date"
              value={maturityDate}
              onChange={(event) =>
                setMaturityDate(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
            />

            <TextField
                label="Assigned Trader"
                type="text"
                value={"Kota"}
                disabled
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent:
                  "flex-end",
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/rfqs")
                }
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  !canSubmit ||
                  isLoading
                }
              >
                {isLoading
                  ? "Creating..."
                  : "Create RFQ"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};