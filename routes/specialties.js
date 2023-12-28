const express = require('express')
const router = express.Router()
const specialtyController = require('../controllers/specialtyController')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialty:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the specialty.
 *       required:
 *         - name
*/

/**
 * @swagger
 * /specialties:
 *   get:
 *     summary: Get all specialties
 *     description: Returns all medical specialties.
 *     tags: [Specialties]
 *     responses:
 *       '200':
 *         description: Successfully retrieved specialties.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Specialty'
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.get('/specialties', specialtyController.getAllSpecialties)

/**
 * @swagger
 * /specialties:
 *   post:
 *     summary: Create a new specialty
 *     description: Creates a new medical specialty.
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []  # Authentication token is required
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del admin.
 *         schema:
 *           type: string
 *           format: JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Specialty'
 *     responses:
 *       '200':
 *         description: Specialty created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Informational message.
 *       '409':
 *         description: Conflict. A specialty with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the specialty already exists.
 *                 existingSpecialty:
 *                   $ref: '#/components/schemas/Specialty'
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.post('/specialties', authMiddleware.authMiddleware, authMiddleware.isAdmin, specialtyController.createSpecialty)

module.exports = router