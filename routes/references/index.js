const express = require("express");
const ReferenceService = require("../../services/referenceService");
const reference = require("../../models/reference");
const axios = require("axios");
const SP_ACK_URL = "http:localhost:3003/federation-entry-acknowledge";

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

router.route("/add-org").get(async (req, res) => {
  try {
    res.render("reference-check.pug", { title: "Add To Registry" });
  } catch (e) {
    res.render("error", { message: e.message, error: e });
  }
});

router.route("/exists").post(async (req, res) => {
  try {
    const exist = await ReferenceService.exists(req.body.refr);
    if (!exist) throw new Error("Reference doesn't exist!");
    const constructed_url =process.env.AGENT_CONTROLLER + "/resolve-did?did="+req.body.did;
    let response = await axios.get(
      constructed_url
    );
    let data = {
      refr: req.body.myrefr,
    };
    // send acknowledge to the other party
    response = await axios.post(SP_ACK_URL, data);
    if (!response.success) throw new Error("Failed to get acknowledgement!");
    data = {
      domain: req.body.domain,
      org: req.body.org,
      did: req.body.did,
    };

    response = await axios.post(process.env.FABRIC, data);
    // if (!response.success)
    //   throw new Error("Transaction failed for some reason");
    res.status(201).json({ success: true });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ success: false });
  }
});

router.route("/federation-entry-acknowledgement").post(async (req, res) => {
  try {
    const exist = await ReferenceService.exists(req.body.refr);
    if (!exist) throw new Error("Reference doesn't exist!");
    // resolving DID
    const constructed_url =process.env.AGENT_CONTROLLER + "/resolve-did?did="+req.body.did;
    let response = await axios.get(
      constructed_url
    );
    let data = {
      domain: req.body.domain,
      org: req.body.org,
      did: req.body.did,
    };
    response = await axios.post(process.env.FABRIC, data);
    res.status(201).json({ success: true });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ success: false });
  }
});

router.route("/addOrg").get(async (req, res) => {
  try {
    res.render("addOrg.pug");
  } catch (e) {
    res.render("error", { message: e.message, error: e });
  }
});

module.exports = router;
