import { useDimHandler } from "./useDimHandler";
import { useResets } from "../useResets";
import { useTimeline } from "./useTimeline";

import { dimensions as d_data } from "../../../data/dimensions";

export const selectDimension = (dimension, hero) => {
  if (hero.dims.teleportedMode) {
    let status = 1;
    status = (dimension.id.startsWith('d-')? 2: status);
    status = (dimension.id.startsWith('c-')? 3: status);

    hero.dims.selectedDim = {
        id: dimension.id,
        x: dimension.x,
        y: dimension.y,
        status: status,
    }

    return;
  }

  if (hero.isSingularity) return;

  const id = dimension.id;
  const newD = d_data.value.find((ds) => ds.id === id);
  const currentD = d_data.value.find((ds) => ds.id === hero.dId);

  if (hero.dimensionStatus == 3 && !newD.id.startsWith("c-")) return;

  if (useDimHandler().d_req(newD)) return;

  if (newD.id == "eternity") {
    useDimHandler().toggleOtherDimensions();
    return;
  }

  if (newD.id.startsWith("d-")) selectDarkD(newD, hero);
  else hero.darkId = [];

  if (hero.dId == newD.id && hero.dId !== "time") return;

  if (newD.id == "dimMerge" && hero.mainInfTier < 100) return;

  if (newD.id == "eternity") return;

  hero.infTier = newD.id === "main" ? hero.mainInfTier ?? 0 : newD.infTier;

  hero.infTier =
    newD.id == "advanceBH"
      ? useTimeline().timelineEffects().infTier
      : hero.infTier;

  hero.dId = newD.id == "eternity" ? hero.dId : newD.id;

  if (newD.id == "bh") {
    d_data.value[25].infTier = 50 + 5 * hero.bhTier;
  }

  useResets().performD(newD, currentD);
};

const selectDarkD = (newD, hero) => {
  const darkDimensions = d_data.value.filter((d) => d.id.startsWith("d-"));
  const newActiveIdx = dimensionGraph[newD.idx] || [];
  const newActiveIds = newActiveIdx
    .map((idx) => d_data.value.find((d) => d.idx === idx))
    .filter((d) => d && d.id.startsWith("d-"))
    .map((d) => d.id);

  for (const id of newActiveIds) {
    if (!hero.darkId.includes(id)) {
      hero.darkId.push(id);
    }
  }

  hero.darkId = hero.darkId.filter((id) => newActiveIds.includes(id));
};

const dimensionGraph = {
  26: [],
  27: [],
  28: [26, 27],
  29: [28, 27, 26],
  30: [29, 28, 27, 26],
  31: [28, 27, 26],
  32: [31, 28, 27, 26],
  33: [32, 31, 28, 27, 26],
  34: [32, 31, 28, 27, 26],
  35: [34, 32, 31, 28, 27, 26],
  36: [35, 34, 32, 31, 28, 27, 26],
  37: [36, 35, 34, 32, 31, 28, 27, 26],
  38: [34, 32, 31, 28, 27, 26],
  39: [35, 34, 32, 31, 28, 27, 26],
};
