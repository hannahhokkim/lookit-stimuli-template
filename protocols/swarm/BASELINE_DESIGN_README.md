# SWARM: five conditions

Use `SWARM_FIVE_CONDITIONS.json` in the Lookit study editor. The two existing copy/paste JSON files contain the same revised protocol. The previous versions are saved in `archive-before-baseline-redesign`. The downloaded pilot protocol and participant data remain unchanged.

Each baby is randomly assigned to one of five conditions with equal probability:

| Condition | Revealed agents per group |
| --- | --- |
| Baseline, full number | 16 |
| Different goals, half number | 8 |
| Different goals, full number | 16 |
| Same goal, half number | 8 |
| Same goal, full number | 16 |

Baseline babies see the reveal without the action demonstration. Each baby sees four test trials, alternating one-group and two-group reveals: 1–2–1–2 or 2–1–2–1. Each outcome appears twice. The ten condition-by-starting-order assignments have equal weights; random assignment does not guarantee equal realized sample sizes. The goal-by-number comparison uses the four action conditions, with revealed group count accounted for. The full-number baseline assesses one-group versus two-group looking at full size; it does not provide a half-versus-full baseline comparison.

The previous `SWARM_BASELINE_VS_DIFFERENT_GOALS.json` filename remains an identical compatibility copy. The preceding protocol is saved in `archive-before-five-condition-redesign`.

Everyone first sees the existing four short introductory object videos. Their order is independently randomized between 1–2–2–1 and 2–1–1–2. They are not the baseline test condition. The existing attention video appears before testing and between successive tests.

Baseline test files use the new `mp4/swarm-baseline-videos/` paths. Existing introductory filenames are not repurposed. Different-goals and same-goal stimuli retain their original v18 URLs, including the number manipulations. The one-group displays remain the yellow groups used in the current materials.

All five conditions use the infant-control frame with spacebar ending and P for pause. The instructions now specify approximately two continuous seconds of looking away. The old instruction movie page was replaced with written instructions because its criterion was inconsistent. The existing practice examples are retained with explicit text stating the two-second rule and noting that the example parent may respond later. They still need review in the Lookit preview.

`measurementPeriodDelay` is 5 seconds for baseline and 54 seconds for the goal conditions. This starts the parent-control interval after the opening and prevents spacebar termination beforehand. Baseline files are 55 seconds long; goal-condition files are 104 seconds, giving a configured maximum measurement interval of 50 seconds for each video. The 54-second value follows the existing test protocol and is approximate: the occluder animation continues during the beginning of that interval. Baseline 5 seconds marks the fully settled display. These are operational timing conventions, not identical frame-verified full-visibility onsets. Frame-by-frame gaze analysis should use each video's actual reveal onset. No videos were changed by this redesign.

The new `totalLookingTime` starts at the delayed parent-control period. Do not apply the pilot analysis's subtraction of 54 seconds to these new values. The frame records elapsed parent-controlled duration, not continuous gaze coding, because no lookaway-hold key is configured. Use event records and the protocol-version field to distinguish these sessions from the pilot. Preserve ceiling observations as censored when appropriate.

The design combines a baseline inspired by Brody et al. (2022) with a goal-by-number manipulation. It uses four test trials at the user’s request rather than the paper’s two. It is not an exact replication: SWARM uses groups with a number manipulation, and parents control online stopping rather than a laboratory experimenter. The paper's exposure-only condition is omitted as requested. Offline attention checks and exclusion decisions are not automated in this JSON.

Validation expands all ten parameter sets locally and checks both stimulus paths and condition metadata. A full Lookit preview is still necessary to check video loading, webcam permissions, timing, pause/restart behavior, and spacebar gating in the deployed frameplayer. Saving or uploading this JSON does not itself change the live Lookit study.

Documentation: https://lookit.readthedocs.io/projects/frameplayer/en/latest/mixins/infant-controlled-timing.html
