---
title: "AI Walking Cane: LLM-Powered Elderly Care IoT Device"
meta_title: "AI Cane - BeiDou GPS, 4G LLM Voice Assistant for Elderly"
description: "An AI-enhanced smart walking cane built for elderly users, combining BeiDou satellite positioning, 4G connectivity, and a push-to-talk voice interface powered by a large language model agent for natural conversation and mobile safety."
date: 2026-03-01T00:00:00Z
image: "/images/showcase/ai-cane/ai-cane-cover-21x9.webp"
categories: ["Edge AI", "IoT", "AI Engineering", "Lifestyle"]
tags: ["Elderly Care", "IoT", "LLM", "BeiDou GPS", "4G", "Voice AI", "Agent"]
draft: false
---

### The Challenge: Bridging Safety, Connectivity, and Companionship for Elderly Users

For elderly individuals with mobility challenges, a walking cane is already an indispensable tool. But beyond physical support, this demographic faces three compounded problems that traditional assistive devices cannot solve.

*   **Emergency Location:** When an elderly person falls or gets lost—especially in low-familiarity outdoor environments—family members and caregivers have no reliable way to locate them quickly.
*   **Digital Isolation:** Many elderly users lack the dexterity, eyesight, or digital literacy to operate smartphones. Voice communication is the most natural interface, but requires a device that is always in hand and always on.
*   **Cognitive Engagement & Emotional Support:** Loneliness and cognitive decline are serious health risks for the elderly. Passive devices offer no conversational engagement or cognitive stimulation.

The challenge was to embed all of these capabilities into a device the user is already holding—the cane—without adding technical complexity for the end user.

### The Solution: The MOTA AI Agent Platform on the Cane

#### Hardware Architecture

The device combines purpose-built hardware with MOTA's cloud-edge software layer:

| Component | Function |
|---|---|
| **Voice Chip** | On-device audio capture and playback hardware |
| **Lierda 4G Module** | Always-on cellular connectivity for cloud inference |
| **BeiDou Positioning Chip** | Real-time satellite GPS location tracking |
| **AI Button** | Single-button press-to-talk interface—no screen, no app required |

#### Interaction Flow: Push-to-Talk

The entire user experience is reduced to a single physical gesture, optimized for elderly motor capability:

1. **Press & Hold** the AI button → the microphone activates; the user speaks naturally.
2. **Release** the button → the voice input is streamed via 4G to the cloud LLM.
3. The LLM processes the query and streams a response back as synthesized audio.
4. The user hears the reply through the built-in speaker.

**Interrupt support:** If the LLM is mid-response and the user press-holds the button again, playback is immediately silenced and the system prepares for a new query. This eliminates frustrating, unskippable responses.

#### LLM Integration: China Mobile Large Model

MOTA's Agent Platform was extended with a new **China Mobile LLM** connector, allowing enterprises to select it as the underlying reasoning model in the agent configuration. This enables:

*   **Natural conversation** beyond keyword recognition—the model understands elliptical, colloquial speech common in elderly users.
*   **Domain-specific knowledge** via agent configuration, such as health reminders, medication schedules, or local weather.
*   **Multi-turn memory** within a session, allowing naturally flowing dialogue.

#### Agent API Layer

MOTA engineered two clean integration interfaces for the Nanjing Liqi hardware platform:

*   **ASR (Speech-to-Text):** Accepts the raw audio stream captured by the microphone and returns a transcript for LLM inference.
*   **TTS (Text-to-Speech):** Accepts the LLM's text response and streams synthesized audio back to the cane's speaker with a playback command signal.

This clean API boundary allows the hardware team and AI platform to evolve independently, reducing integration complexity and accelerating future updates.

### Impact

By embedding voice AI, satellite positioning, and an LLM agent into a daily-use medical device, this solution delivers measurable value across three dimensions:

*   **Safety:** BeiDou GPS enables real-time location sharing with family members or caregivers, enabling rapid emergency response.
*   **Accessibility:** A single push-to-talk button is the only required user action—no smartphone, no app, no learning curve.
*   **Companionship:** Natural language LLM conversation provides cognitive engagement and emotional connection for users living alone or in low-interaction environments.
