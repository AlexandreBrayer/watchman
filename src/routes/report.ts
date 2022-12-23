import express, { Request, Response } from "express";
import Report from "../models/Report";
import Process from "../models/Process";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const reports = await Report.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Report.countDocuments();

    res.status(200).json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const report = await Report.findById(id);
    res.status(200).json(report);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/lastreport/:idProcess", async (req: Request, res: Response) => {
  const idProcess = req.params.idProcess;
  try {
    const report = await Report.find({ process: idProcess })
      .sort({ createdAt: -1 })
      .limit(1);
    res.status(200).json(report);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/lastfluxreport/:idFlux", async (req: Request, res: Response) => {
  const idFlux = req.params.idFlux;
  try {
    const processes = await Process.find({ flux: idFlux });
    const reports = await Report.find({ process: { $in: processes } })
      .sort({ createdAt: -1 })
      .limit(processes.length);
    res.status(200).json(reports);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


export default router;
