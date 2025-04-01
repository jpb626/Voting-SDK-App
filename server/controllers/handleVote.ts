import { Request, Response } from "express";
import { errorHandler, getCredentials, getDroppedAsset, initializeDroppedAssetDataObject } from "../utils/index.js";

export const handleVote = async (req: Request, res: Response) => {
  try {
    // Extract credentials and vote details
    const credentials = getCredentials(req.query);
    const { assetId, urlSlug } = credentials;
    const { optionId, profileId } = req.body;
    if (optionId === undefined || !profileId) {
      return res.status(400).json({ success: false, message: "optionId and profileId are required" });
    }

    // Get the dropped asset and ensure its data object exists
    const droppedAsset = await getDroppedAsset(credentials);
    // await initializeDroppedAssetDataObject(droppedAsset);

    // Fetch the current data object to get the full poll
    await droppedAsset.fetchDataObject();
    const currentPoll = droppedAsset.dataObject.poll || {};

    const updatedPoll = {
      question: currentPoll.question || "",
      answers: currentPoll.answers || [],
      displayMode: currentPoll.displayMode || "percentage",
      options: {
        ...currentPoll.options,
        [optionId]: { votes: (currentPoll.options?.[optionId]?.votes || 0) + 1 },
      },
      results: {
        ...currentPoll.results,
        [profileId]: { answer: optionId },
      },
    };
    const lockId = `${assetId}-voteUpdate-${new Date(Math.round(new Date().getTime() / 10000) * 10000)}`;

    // Update the entire poll object in one go
    await droppedAsset.updateDataObject(
      {
        poll: updatedPoll,
        lastInteractionDate: new Date(),
      },
      { lock: { lockId, releaseLock: true } }
    );

    // Log the updated poll data for debugging
    await droppedAsset.fetchDataObject();
    console.log("Vote updated, poll data:", droppedAsset.dataObject.poll);

    return res.json({ success: true, poll: droppedAsset.dataObject.poll });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleVote",
      message: "Error recording vote",
      req,
      res,
    });
  }
};
