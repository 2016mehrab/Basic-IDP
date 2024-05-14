const express = require("express");
const ReferenceService = require("../../services/referenceService");
const reference = require("../../models/reference");
const axios = require("axios");
const fabric_create_endpoint = "http://127.0.0.1:3000/create";

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
  // Do the DID processing in this route
  try {
    const exist = await ReferenceService.exists(req.body.refr);
    //open another route
    if (!exist) throw new Error("Reference doesn't exist!");
    // add DID resolve checking
    const constructed_url =process.env.AGENT_CONTROLLER + "/resolve-did?did="+req.body.did;
    console.log("Constructed url", constructed_url);
    let response = await axios.get(
      constructed_url
    );
    // adding to registry
    // let data = {
    //   did: req.body.did,
    //   org: req.body.org,
    //   key: 134,
    // };
    // let response = await axios.post(fabric_create_endpoint, data);
    // if (!response.success)
    //   throw new Error("Transaction failed for some reason");
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
