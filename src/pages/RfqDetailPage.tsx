import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  type RfqDto,
  useChangeRfqRfqRfqIdPatchMutation,
  useGetRfqRfqRfqIdGetQuery,
  useStpRfqPricingRfqRfqIdStopPricingPostMutation,
} from "../app/api/generatedApi";
import { usePricingUpdates } from "../features/pricing/usePricingUpdates";

export const RfqDetailPage = () => {
  const navigate = useNavigate();

  const { rfqId } = useParams<{
    rfqId: string;
  }>();

  const {
    data: rfq,
    isLoading,
    error,
    refetch,
  } = useGetRfqRfqRfqIdGetQuery(
    {
      rfqId: rfqId ?? "",
    },
    {
      skip: !rfqId,
    },
  );

  const requestIds = useMemo(
    () => (rfqId ? [rfqId] : []),
    [rfqId],
  );

  const {
    prices,
    connectionState,
  } = usePricingUpdates(requestIds);

  const [editOpen, setEditOpen] =
    useState(false);

  const [stopOpen, setStopOpen] =
    useState(false);

  const [notification, setNotification] =
    useState<string | null>(null);

  const [
    stopPricing,
    {
      isLoading: isStopping,
    },
  ] =
    useStpRfqPricingRfqRfqIdStopPricingPostMutation();

  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load RFQ.
        </Alert>
      </Container>
    );
  }

  if (!rfq || !rfqId) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          RFQ not found.
        </Alert>
      </Container>
    );
  }

  const price = prices[rfq.rfq_id];

  const handleStopPricing = async () => {
    try {
      await stopPricing({
        rfqId,
      }).unwrap();

      setStopOpen(false);

      setNotification(
        "Pricing has been stopped.",
      );
    } catch {
      setNotification(
        "Failed to stop pricing.",
      );
    }
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ py: 4 }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              onClick={() =>
                navigate("/rfqs")
              }
            >
              Back to RFQs
            </Button>

            <Chip
              label={`Pricing: ${connectionState}`}
              color={
                connectionState === "connected"
                  ? "success"
                  : connectionState === "error"
                    ? "error"
                    : "default"
              }
              variant="outlined"
            />
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4">
                RFQ Detail
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {rfq.rfq_id}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  setEditOpen(true)
                }
              >
                Edit RFQ
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  setStopOpen(true)
                }
              >
                Stop Pricing
              </Button>
            </Stack>
          </Stack>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Live Par Rate
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontVariantNumeric:
                      "tabular-nums",
                  }}
                >
                  {formatParRate(
                    price?.par_rate,
                  )}
                </Typography>
              </Box>

              <Divider />

              <DetailItem
                label="Notional"
                value={rfq.notional}
              />

              <DetailItem
                label="Currency"
                value={rfq.currency}
              />

              <DetailItem
                label="Fixed Leg"
                value={rfq.fixed_leg}
              />

              <DetailItem
                label="Effective Date"
                value={rfq.effective_date}
              />

              <DetailItem
                label="Maturity Date"
                value={rfq.maturity_date}
              />
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <EditRfqDialog
        rfq={rfq}
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        onUpdated={async () => {
          setEditOpen(false);

          await refetch();

          setNotification(
            "RFQ has been updated.",
          );
        }}
      />

      <Dialog
        open={stopOpen}
        onClose={() =>
          setStopOpen(false)
        }
      >
        <DialogTitle>
          Stop Pricing?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Pricing for this RFQ will
            be stopped.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setStopOpen(false)
            }
            disabled={isStopping}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleStopPricing}
            disabled={isStopping}
          >
            {isStopping
              ? "Stopping..."
              : "Stop Pricing"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification !== null}
        autoHideDuration={3000}
        onClose={() =>
          setNotification(null)
        }
        message={notification}
      />
    </>
  );
};

type EditRfqDialogProps = {
  rfq: RfqDto;
  open: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

const EditRfqDialog = ({
  rfq,
  open,
  onClose,
  onUpdated,
}: EditRfqDialogProps) => {
  const [notional, setNotional] =
    useState(rfq.notional);

  const [
    effectiveDate,
    setEffectiveDate,
  ] = useState(
    rfq.effective_date,
  );

  const [
    maturityDate,
    setMaturityDate,
  ] = useState(
    rfq.maturity_date,
  );

  const [
    fixedLeg,
    setFixedLeg,
  ] = useState(rfq.fixed_leg);

  const [
    changeRfq,
    {
      isLoading: isChanging,
      error,
    },
  ] =
    useChangeRfqRfqRfqIdPatchMutation();

  const handleSave = async () => {
    await changeRfq({
      rfqId: rfq.rfq_id,

      changeSwapRfqRequest: {
        notional,
        effective_date: effectiveDate,
        maturity_date: maturityDate,
        fixed_leg: fixedLeg,
        currency: rfq.currency,
      },
    }).unwrap();

    await onUpdated();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Edit RFQ
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            mt: 1,
          }}
        >
          {error && (
            <Alert severity="error">
              Failed to update RFQ.
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
          />

          <TextField
            label="Fixed Leg"
            select
            value={fixedLeg}
            onChange={(event) =>
              setFixedLeg(
                event.target.value as
                  | "pay"
                  | "receive",
              )
            }
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
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isChanging}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isChanging}
        >
          {isChanging
            ? "Saving..."
            : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type DetailItemProps = {
  label: string;
  value: string;
};

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography>
        {value}
      </Typography>
    </Stack>
  );
};

const formatParRate = (
  value?: string,
): string => {
  if (value === undefined) {
    return "-";
  }

  return Number(value).toFixed(4);
};
