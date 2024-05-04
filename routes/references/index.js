const express = require("express");
const ReferenceService = require("../../services/referenceService");
const reference = require("../../models/reference");

const router = express.Router();
router
  .route("/")
  .get(async (req, res) => {
    try {
      const references = await ReferenceService.getAll();
      res.render("reference-list.pug", { references, title: "References" });
      //   res.status(200).json(references);
    } catch (e) {
      res.render("error", { message: e.message, error: e });
    }
  })
  .post(async (req, res) => {
    try {
      console.log("REQ BODY", req.body);

      const reference = await ReferenceService.create({
        reference: req.body.refr,
      });
      res.status(201).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false });
    }
  });

router.route("/form").get(async (req, res) => {
  try {
    res.render("reference-form.pug", { title: "Reference Form" });
  } catch (e) {
    res.render("error", { message: e.message, error: e });
  }
});

router.route("/validate").get(async (req, res) => {
  try {
    res.render("reference-check.pug", { title: "Validate Reference" });
  } catch (e) {
    res.render("error", { message: e.message, error: e });
  }
});

router.route("/exists").post(async (req, res) => {
  try {
    const exist = await ReferenceService.exists(req.body.refr);
    if (!exist) throw new Error("Reference doesn't exist!");
    res.status(201).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false });
  }
});

module.exports = router;
