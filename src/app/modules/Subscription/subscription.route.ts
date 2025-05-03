import express from 'express';
import { SubcriptionController } from './subscription.controller';


const router = express.Router();

// router.post('/initiate', SubcriptionController.initiatePayment);
// router.post('/success', SubcriptionController.handlePaymentSuccess);
// router.post('/fail', SubcriptionController.handlePaymentFail);
// router.post('/cancel', SubcriptionController.handlePaymentCancel);
// router.get('/user/:userId', SubcriptionController.getUserSubscriptions);

export const SubscriptionRoutes = router;