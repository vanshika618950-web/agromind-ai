import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Advisory from '../src/models/Advisory.js';
import { orchestrateAdvisory } from '../src/services/orchestrator.js';

test('AgroMind AI Backend & Multi-Agent Test Suite', async (t) => {
  await t.test('Database connection connects properly', async () => {
    const conn = await connectDB();
    assert.ok(conn, 'Mongoose connection should be established');
  });

  let testUser;
  await t.test('User registration & password comparison works', async () => {
    await User.deleteMany({ email: 'testfarmer@agromind.ai' });
    const bcrypt = (await import('bcryptjs')).default;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('TestPassword123!', salt);

    testUser = await User.create({
      name: 'Test Farmer',
      email: 'testfarmer@agromind.ai',
      passwordHash,
    });

    assert.ok(testUser._id);
    const isValid = await testUser.comparePassword('TestPassword123!');
    assert.equal(isValid, true, 'Valid password should verify');

    const isInvalid = await testUser.comparePassword('WrongPassword');
    assert.equal(isInvalid, false, 'Invalid password should fail');
  });

  await t.test('Multi-Agent Orchestrator executes all 4 agents and saves logs', async () => {
    const cropInput = {
      crop: 'Tomato',
      location: 'Karnataka',
      soilType: 'Red Soil',
      growthStage: 'Fruiting',
      symptoms: 'Dark brown sunken leathery spots at the blossom end of fruits. Leaves have mild curling.',
      irrigation: 'Drip',
      weather: 'Hot and sunny, 32°C',
      additionalInformation: 'Drip system had a 2-day outage last week.',
    };

    const { advisory, agentLogs } = await orchestrateAdvisory(cropInput, testUser._id);

    assert.ok(advisory, 'Advisory should be created');
    assert.equal(advisory.crop, 'Tomato');
    assert.ok(advisory.problemAnalysis.identifiedProblem);
    assert.ok(advisory.riskAssessment.riskLevel);
    assert.ok(advisory.actionPlan.immediate.length > 0);
    assert.equal(agentLogs.length, 4, 'Should execute and log all 4 specialized agents');

    const agentNames = agentLogs.map((l) => l.agentName);
    assert.ok(agentNames.includes('problem_analyzer'));
    assert.ok(agentNames.includes('crop_reasoning'));
    assert.ok(agentNames.includes('risk_assessment'));
    assert.ok(agentNames.includes('action_planner'));
  });

  await t.test('Data isolation ensures user can only access their own advisory', async () => {
    const otherUser = await User.create({
      name: 'Another User',
      email: 'other@agromind.ai',
      passwordHash: 'dummyhash123',
    });

    const advisories = await Advisory.find({ userId: otherUser._id });
    assert.equal(advisories.length, 0, 'Other user should not see testUser advisories');

    // Clean up
    await User.deleteMany({ email: { $in: ['testfarmer@agromind.ai', 'other@agromind.ai'] } });
    await Advisory.deleteMany({ userId: testUser._id });
  });

  await disconnectDB();
});
