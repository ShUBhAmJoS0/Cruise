import express from 'express';
import CommunityGuideline from '../model/CommunityGuideline.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const guidelines = await CommunityGuideline.findAll({
      where: { isActive: true },
      order: [['orderIndex', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: guidelines
    });
  } catch (error) {
    console.error('Error fetching guidelines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community guidelines'
    });
  }
});

// Get single guideline by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const guideline = await CommunityGuideline.findOne({
      where: { 
        id,
        isActive: true 
      }
    });

    if (!guideline) {
      return res.status(404).json({
        success: false,
        message: 'Guideline not found'
      });
    }

    res.status(200).json({
      success: true,
      data: guideline
    });
  } catch (error) {
    console.error('Error fetching guideline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guideline'
    });
  }
});

export default router;