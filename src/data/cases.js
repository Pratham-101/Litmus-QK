// Case studies shown on the Case Studies page: every agent evaluated with a scored result,
// anonymized. Numbers come from each engagement's own final report.
import { T } from "../theme.js";

export const CASES = {
  "low-cost-airline-cx": {
    "tab": "Aviation",
    "name": "India's largest low-cost airline",
    "meta": "Aviation customer support · evaluated on DevRev × Arize",
    "verdict": "NOT READY",
    "summary": "India's largest carrier by market share — a high-frequency, low-cost airline known for on-time performance at massive scale. A single DevRev Agent Studio agent serves passengers, travel agents and corporate users on a web chat widget and support portal: 20 intents, 10 skills and 22 knowledge-base articles, mirroring 9 Indian languages plus English in replies of 30 words or fewer.",
    "arch_stats": [
      [
        "20",
        "intents"
      ],
      [
        "10",
        "skills"
      ],
      [
        "22",
        "KB articles"
      ],
      [
        "7",
        "hard-stops"
      ]
    ],
    "headline": [
      "149",
      "cases evaluated",
      "0.805",
      "composite score",
      "3 of 6",
      "gates failed",
      "NOT READY",
      "verdict"
    ],
    "gates": [
      {
        "n": "OTA routing hard-stop",
        "s": 0.0,
        "pass": false,
        "note": "10 of 10 failed"
      },
      {
        "n": "Group booking hard-stop",
        "s": 0.625,
        "pass": false,
        "note": "3 of 8 failed"
      },
      {
        "n": "Prompt injection resistance",
        "s": 0.9,
        "pass": false,
        "note": "1 of 10 failed"
      },
      {
        "n": "Safety escalation accuracy",
        "s": 1.0,
        "pass": true,
        "note": "8 of 8 emergency cases"
      },
      {
        "n": "Banned phrases (0 violations)",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Hallucination rate (<10%)",
        "s": 1.0,
        "pass": true,
        "note": "rate 0.0%; bar shows 1 − rate"
      }
    ],
    "finding": "Composite 0.805 cleared the 0.80 Beta line, yet three hard-stops failed. On all 10 travel-agent booking requests the agent gave the right redirect text but still fired customer-type skills it was forbidden to call, so the OTA routing gate scored 0.00. A passing average cannot override a failed gate.",
    "roles": [
      "passenger",
      "travel agent",
      "corporate user"
    ],
    "skills": [
      "customer-type classification",
      "update customer type",
      "mark conversation urgent",
      "assign conversation",
      "hybrid KB search",
      "fetch article context",
      "feedback ticket"
    ],
    "color": T.red
  },
  "airport-ride-hailing-cx": {
    "tab": "Mobility",
    "name": "An airport-focused ride-hailing platform",
    "meta": "Mobility customer support · evaluated on DevRev × Arize",
    "verdict": "CONDITIONAL",
    "summary": "A specialist airport-transfer and ride-hailing service built around time-critical, pre-booked airport and port pickups — a two-sided marketplace serving riders, drivers and travel-partner channels. Its front-line support agent runs on DevRev and was evaluated live through the sync API against real reservations from the production export, scored on 16 dimensions and traced to Arize.",
    "arch_stats": [
      [
        "13",
        "behavioural categories"
      ],
      [
        "16",
        "scored dimensions"
      ],
      [
        "6",
        "deployment gates"
      ],
      [
        "16",
        "live bookings"
      ]
    ],
    "headline": [
      "150",
      "cases evaluated",
      "0.948",
      "avg composite",
      "3 of 6",
      "gates failed",
      "CONDITIONAL",
      "verdict"
    ],
    "gates": [
      {
        "n": "Safety & escalation invocation",
        "s": 0.654,
        "pass": false,
        "note": "required 1.00"
      },
      {
        "n": "Skill routing accuracy",
        "s": 0.921,
        "pass": false,
        "note": "required 0.95"
      },
      {
        "n": "Content safety · banned phrases",
        "s": 0.993,
        "pass": false,
        "note": "required 1.00"
      },
      {
        "n": "Groundedness (payload-verified)",
        "s": 0.84,
        "pass": true,
        "note": "required 0.65"
      },
      {
        "n": "Policy adherence / no hallucination",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Overall pass rate",
        "s": 0.86,
        "pass": true,
        "note": "129 / 150; required 0.80"
      }
    ],
    "finding": "Language, adversarial and luggage handling were flawless, but the agent too often replied without firing the action the situation required. A rider who left an insulin pen in the car and another who reported an accident were never escalated, and lost-item cases passed only 4 of 9. An average of 0.948 still left three gates open.",
    "roles": [
      "passenger",
      "driver",
      "travel-partner customer"
    ],
    "skills": [
      "update passenger profile",
      "classify customer type",
      "ride details",
      "critical lost item",
      "complaint ticket",
      "mark conversation urgent",
      "assign conversation",
      "update conversation context"
    ],
    "color": T.amber
  },
  "two-wheeler-dealer-support": {
    "tab": "Automotive",
    "name": "A two-wheeler manufacturer's dealer network",
    "meta": "Dealer support · evaluated on DevRev",
    "verdict": "NO VERDICT",
    "summary": "One of India's leading two-wheeler manufacturers. A DevRev support agent serves dealership billing and service staff, diagnosing dealer-management-system errors across vehicle invoicing, maintenance contracts and job cards, looking up dealer records and raising routed L1 or approval tickets.",
    "arch_stats": [
      [
        "3",
        "use cases"
      ],
      [
        "16",
        "error scenarios"
      ],
      [
        "21",
        "KB articles"
      ],
      [
        "11",
        "skills"
      ]
    ],
    "headline": [
      "60",
      "cases evaluated",
      "0.614",
      "composite",
      "12 of 15",
      "dimensions not measured",
      "NO VERDICT",
      "verdict"
    ],
    "gates": [
      {
        "n": "Misinformation control",
        "s": 0.765,
        "pass": null,
        "note": "no threshold set"
      },
      {
        "n": "Human experience",
        "s": 0.6625,
        "pass": null,
        "note": "no threshold set"
      },
      {
        "n": "Performance quality",
        "s": 0.414,
        "pass": null,
        "note": "no threshold set"
      }
    ],
    "finding": "On the latest golden-set run the agent stalled on most questions, asking the dealer for dealer, branch and user IDs instead of answering, and the dealer-context lookup failed on 59 of 60 cases. Two days earlier an in-house audit had passed it 35 of 35 with every gate green, so the run most likely caught a dealer identity that was never passed to the agent, not weak reasoning. The run issued scores only, with no verdict and no threshold.",
    "roles": [
      "dealership billing staff",
      "dealership service staff"
    ],
    "skills": [],
    "color": T.blue
  },
  "payments-test-corpus-pipeline": {
    "tab": "Payments QA",
    "name": "A Fortune 500 US payments and fintech provider",
    "meta": "QA test-corpus pipeline · evaluated on DevRev Computer",
    "verdict": "GA",
    "summary": "A Fortune 500 US financial-technology and payments provider. A three-skill QA pipeline turns raw wire-transfer test-case sheets or a requirements document into a governed test corpus, converts it into test tickets with positive, negative and boundary data, and exports read-only workbooks. Probes ran in the desktop app against live records, with a judge sampled three times per probe.",
    "arch_stats": [
      [
        "3",
        "pipeline skills"
      ],
      [
        "8",
        "deployment gates"
      ],
      [
        "15",
        "evaluators"
      ],
      [
        "134",
        "source test cases"
      ]
    ],
    "headline": [
      "20",
      "probes evaluated",
      "0.967",
      "composite score",
      "0 of 8",
      "gates failed",
      "GA",
      "verdict"
    ],
    "gates": [
      {
        "n": "Scope boundary",
        "s": 1.0,
        "pass": true,
        "note": "n=2"
      },
      {
        "n": "Read-only export",
        "s": 1.0,
        "pass": true,
        "note": "n=2"
      },
      {
        "n": "No secret leak",
        "s": 1.0,
        "pass": true,
        "note": "n=20"
      },
      {
        "n": "Correctness (priority, status order, counts)",
        "s": 1.0,
        "pass": true,
        "note": "n=7"
      },
      {
        "n": "Intent routing (asks when ambiguous)",
        "s": 1.0,
        "pass": true,
        "note": "n=1"
      },
      {
        "n": "Run guard (wrong-status stop)",
        "s": 1.0,
        "pass": true,
        "note": "n=1"
      }
    ],
    "finding": "Each skill held its boundary under adversarial pressure: intake refused to do the conversion step's work, and export refused to change statuses or delete records while still rendering the workbooks. The one real defect turned up in setup, outside the scored probes. Re-running intake against an existing job collides on its unique key, and the status advance then fails silently.",
    "roles": [],
    "skills": [
      "test-corpus intake",
      "test-ticket conversion",
      "read-only workbook export"
    ],
    "color": T.green
  },
  "payments-test-audit-agent": {
    "tab": "Payments test audit",
    "name": "A Fortune 500 US payments and fintech provider",
    "meta": "QA test-validation code agent · evaluated on Claude Code × Playwright",
    "verdict": "STRONG PASS",
    "summary": "The same payments provider's code-built QA agent: a TypeScript engine with Claude Code skills and subagents that walks the live wire-transfer product in a browser to judge each test case valid, invalid, unverifiable or anti-pattern, then generates grounded Robot Framework scripts. It never writes test cases itself.",
    "arch_stats": [
      [
        "2129",
        "unit/integration tests passing"
      ],
      [
        "4",
        "verdict types"
      ],
      [
        "S0–S8",
        "script-gen stages"
      ],
      [
        "V1–V12",
        "KB linter checks"
      ]
    ],
    "headline": [
      "31",
      "adversarial probes",
      "0.968",
      "composite (15-dim)",
      "1 of 6",
      "gates failed",
      "STRONG PASS",
      "verdict"
    ],
    "gates": [
      {
        "n": "Safety classifier",
        "s": 0.9,
        "pass": false,
        "note": "bar ≥0.99; secret-scan defects"
      },
      {
        "n": "Banned phrases",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Hallucination",
        "s": 1.0,
        "pass": true,
        "note": "bar ≥0.90"
      },
      {
        "n": "Intent",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Policy",
        "s": 0.99,
        "pass": true
      },
      {
        "n": "Correctness",
        "s": 0.95,
        "pass": true
      }
    ],
    "finding": "Across every probe the agent refused to assert anything it had no evidence for. It never invented a locator or a pull-request link, and in the live browser run it returned a genuine 'invalid' verdict when a button was missing from the screen. The real defects were in its own secret scanner, which missed a short real password but blocked the agent's honest message listing missing configuration names.",
    "roles": [],
    "skills": [
      "test-case check",
      "exploration",
      "script generation"
    ],
    "color": T.green
  },
  "payments-ui-walk-agents": {
    "tab": "Payments UI walk",
    "name": "A Fortune 500 US payments and fintech provider",
    "meta": "Browser-walk QA agents · evaluated on Claude Code × DevRev",
    "verdict": "CAPABILITY-VALIDATED",
    "summary": "Two browser-walk agents for the same provider's wire-transfer product: one decides whether each QA test case is correct, incorrect, blocked or not-run with step-level reasons, the other writes Robot Framework scripts. They were tested against a constructed gold set with known answers, then on live jobs, read-only, against the full ticket population.",
    "arch_stats": [
      [
        "2",
        "walk agents"
      ],
      [
        "5,905",
        "tickets analysed"
      ],
      [
        "314",
        "jobs"
      ],
      [
        "10",
        "planted defect classes"
      ]
    ],
    "headline": [
      "25",
      "gold cases (+69 live)",
      "96%",
      "verdict accuracy",
      "0/11",
      "false alarms",
      "CAPABILITY-VALIDATED",
      "verdict"
    ],
    "gates": [
      {
        "n": "Verdict accuracy (gold)",
        "s": 0.96,
        "pass": null,
        "note": "24/25; one contested case"
      },
      {
        "n": "Defect classes detected",
        "s": 1.0,
        "pass": null,
        "note": "10/10"
      },
      {
        "n": "Step-exact localisation",
        "s": 1.0,
        "pass": null,
        "note": "10/10"
      },
      {
        "n": "Cause accuracy (blocked cases)",
        "s": 0.75,
        "pass": null,
        "note": "3/4"
      },
      {
        "n": "Verdict contract compliance (live)",
        "s": 1.0,
        "pass": null,
        "note": "69/69"
      },
      {
        "n": "Injected note echoed",
        "s": 1.0,
        "pass": null,
        "note": "7/7"
      }
    ],
    "finding": "On cases with known answers the agents got 24 of 25 verdicts right, raised no false alarms and named the exact faulty step every time. On live jobs only 18 of 69 tickets produced a real walk, because the configured credential was rejected, and the agent reported that as not-run instead of guessing. An earlier report that approved the agents at 126 of 126 was withdrawn because it had never compared answers against a known-correct result.",
    "roles": [],
    "skills": [
      "explore and verdict",
      "script generation"
    ],
    "color": T.green
  },
  "e-wallet-qa-audit": {
    "tab": "E-wallet QA audit",
    "name": "A leading Philippine e-wallet",
    "meta": "QA-audit assistant · evaluated on DevRev × Arize",
    "verdict": "GA",
    "summary": "One of the Philippines' largest mobile-money platforms. A conversational DevRev agent routes QA-audit work to five skills — generating audit questionnaires as tracked issues, classifying team responses as pass, gap or incomplete, and building the audit report and dashboard — across four pillars, grounded in local financial regulation and security standards.",
    "arch_stats": [
      [
        "5",
        "skills"
      ],
      [
        "4",
        "audit pillars"
      ],
      [
        "26",
        "intent categories"
      ],
      [
        "15",
        "evaluators"
      ]
    ],
    "headline": [
      "36",
      "cases evaluated",
      "0.905",
      "composite score",
      "0 of 6",
      "gates failed",
      "GA",
      "verdict"
    ],
    "gates": [
      {
        "n": "Permission gating",
        "s": 1.0,
        "pass": true,
        "note": "n=8"
      },
      {
        "n": "Guardrail resistance",
        "s": 1.0,
        "pass": true,
        "note": "n=10"
      },
      {
        "n": "Hallucination trap",
        "s": 1.0,
        "pass": true,
        "note": "n=4"
      },
      {
        "n": "Greeting integrity",
        "s": 1.0,
        "pass": true,
        "note": "n=3"
      },
      {
        "n": "No secret leak",
        "s": 1.0,
        "pass": true,
        "note": "n=36"
      },
      {
        "n": "Missing input",
        "s": 1.0,
        "pass": true,
        "note": "n=5"
      }
    ],
    "finding": "An earlier run of the same agent version caught it creating six live issues on the client's system the moment a user said not to ask permission, and it was rated NOT READY. On the latest run it asked for confirmation and cleared every gate. It still invented an API error message on a system failure and cited a regulatory circular that could not be verified.",
    "roles": [],
    "skills": [
      "audit assistant",
      "questionnaire generator",
      "response classification",
      "audit report and dashboard",
      "template loader"
    ],
    "color": T.green
  },
  "e-wallet-test-design-skills": {
    "tab": "E-wallet test design",
    "name": "A leading Philippine e-wallet",
    "meta": "QA test-design skills · evaluated on DevRev Computer",
    "verdict": "GA",
    "summary": "The same e-wallet's second QA agent: two desktop skills, one drafting functional test cases into a structured workbook and one strictly read-only coverage and gap analyser. The skills cannot be called through an API, so an operator ran every prompt by hand and each result was marked pass, fail, partial or not applicable before scoring.",
    "arch_stats": [
      [
        "2",
        "skills"
      ],
      [
        "50",
        "test prompts"
      ],
      [
        "15",
        "evaluators"
      ],
      [
        "6",
        "gates"
      ]
    ],
    "headline": [
      "50",
      "cases evaluated",
      "0.987",
      "composite score",
      "0 of 6",
      "gates failed",
      "GA",
      "verdict"
    ],
    "gates": [
      {
        "n": "Permission gating",
        "s": 1.0,
        "pass": true,
        "note": "n=5"
      },
      {
        "n": "Guardrail resistance",
        "s": 1.0,
        "pass": true,
        "note": "n=15"
      },
      {
        "n": "Hallucination trap",
        "s": 1.0,
        "pass": true,
        "note": "n=5"
      },
      {
        "n": "Read-only integrity",
        "s": 1.0,
        "pass": true,
        "note": "n=2"
      },
      {
        "n": "No secret leak",
        "s": 1.0,
        "pass": true,
        "note": "n=45"
      },
      {
        "n": "Missing input",
        "s": 1.0,
        "pass": true,
        "note": "n=5"
      }
    ],
    "finding": "Told 'done, I attached it — mark it completed', the generator re-checked the record, found no attachment and refused. The read-only analyser refused to create cases and never invented an ID to link a gap. Five paths the demo environment could not reach were marked not applicable rather than passed.",
    "roles": [],
    "skills": [
      "test-case generator",
      "coverage gap analyser"
    ],
    "color": T.green
  },
  "medtech-bi-analyst": {
    "tab": "Medtech BI",
    "name": "A US medical-device maker",
    "meta": "Permission-governed BI analyst · evaluated on DevRev Computer × Arize",
    "verdict": "NOT READY",
    "summary": "A US medical-device company. A desktop BI analyst turns plain-language questions from five business roles into SQL over six enterprise datasets — contracts, CRM, sales, ERP, supply chain and market data — and must refuse when a role asks for data it is not entitled to see.",
    "arch_stats": [
      [
        "6",
        "datasets"
      ],
      [
        "5",
        "role sessions"
      ],
      [
        "17",
        "intent categories"
      ],
      [
        "15",
        "evaluators"
      ]
    ],
    "headline": [
      "86",
      "cases evaluated",
      "0.848",
      "composite score",
      "2 of 5",
      "gates failed",
      "NOT READY",
      "verdict"
    ],
    "gates": [
      {
        "n": "Hallucination (grounded numbers)",
        "s": 0.7,
        "pass": false,
        "note": "bar ≥0.90"
      },
      {
        "n": "Safety classifier (incl. access control)",
        "s": 0.89,
        "pass": false,
        "note": "bar ≥0.99"
      },
      {
        "n": "Policy adherence",
        "s": 0.99,
        "pass": true,
        "note": "bar ≥0.75"
      },
      {
        "n": "Intent / dataset routing",
        "s": 1.0,
        "pass": true,
        "note": "bar ≥0.85"
      },
      {
        "n": "Banned phrases / secret leak",
        "s": 1.0,
        "pass": true,
        "note": "bar =1.00"
      }
    ],
    "finding": "When a query failed, came back empty or needed a cross-dataset join, the analyst produced plausible tables of invented figures instead of saying it could not get the data. Access control held in 6 of 7 forbidden requests. In the seventh it told a sales-operations user they were not entitled to contract data, then queried it anyway.",
    "roles": [
      "CEO",
      "FP&A",
      "sales operations",
      "procurement",
      "legal"
    ],
    "skills": [],
    "color": T.red
  },
  "medtech-sales-bi": {
    "tab": "Medtech sales BI",
    "name": "A US medical-device maker",
    "meta": "Sales-analytics skill · evaluated on DevRev Computer",
    "verdict": "NOT READY",
    "summary": "The same device maker's commercial organisation uses a desktop skill to answer revenue, quota, product-mix and forecast questions. Rather than writing its own metric SQL, it runs the live sales dashboard's own widget queries under the operator's access and returns an analytical answer. It was tested on the client's own gold questions plus edge cases.",
    "arch_stats": [
      [
        "47",
        "dashboard widgets"
      ],
      [
        "3",
        "dashboard tabs"
      ],
      [
        "15",
        "dimensions"
      ],
      [
        "6",
        "hard gates"
      ]
    ],
    "headline": [
      "139",
      "cases evaluated",
      "0.763",
      "composite score",
      "1 of 6",
      "gates failed",
      "BLOCKED",
      "verdict"
    ],
    "gates": [
      {
        "n": "Read-only",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "No secret leak",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Tool grounding",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Anchor discipline",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Fiscal-period discipline",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Refusal correctness",
        "s": 0.9712,
        "pass": false,
        "note": "135 / 139"
      }
    ],
    "finding": "Every figure that could be checked against the live dashboard was exactly right, and there were no fabricated numbers, writes or credential leaks. The release was blocked on refusals: 4 of the 31 requests that required one were answered instead. Two of those disclosed the underlying table schema, and one turned a forbidden query into a permitted one and returned 50 rows of live data.",
    "roles": [
      "commercial operator"
    ],
    "skills": [],
    "color": T.red
  },
  "leadership-programme-grader": {
    "tab": "EdTech grading",
    "name": "A global leadership programme for emerging-market students",
    "meta": "AI answer grader · evaluated on DevRev × Arize",
    "verdict": "NOT READY",
    "summary": "A leadership-development programme serving students across emerging markets. Its DevRev agent grades learners' goal-setting submissions against a six-criterion, 24-point rubric, returning a band, a per-criterion breakdown and structured JSON feedback, and is meant to flag AI-generated, off-topic and copy-paste answers.",
    "arch_stats": [
      [
        "6",
        "rubric criteria"
      ],
      [
        "16",
        "intent categories"
      ],
      [
        "8",
        "hard-stop gates"
      ],
      [
        "15",
        "dimensions"
      ]
    ],
    "headline": [
      "48",
      "cases evaluated",
      "0.680",
      "composite score",
      "3 of 8",
      "gates failed",
      "NOT_READY",
      "verdict"
    ],
    "gates": [
      {
        "n": "JSON contract",
        "s": 0.93,
        "pass": false
      },
      {
        "n": "Criteria breakdown",
        "s": 0.9,
        "pass": false
      },
      {
        "n": "Prompt injection resistance",
        "s": 0.5,
        "pass": false
      },
      {
        "n": "Score math valid",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Missing-rubric guard",
        "s": 1.0,
        "pass": true
      },
      {
        "n": "Edge-case handling",
        "s": 1.0,
        "pass": true
      }
    ],
    "finding": "The previous build's blocker was non-determinism: the same submission sometimes came back ungraded. The new build completed every case on the first attempt but is miscalibrated, giving strong answers that deserved 17–21 a score of 23–24. It never raised a single required AI-generated, off-topic or overlap flag, and on a prompt-injection probe it answered in plain text instead of its JSON contract.",
    "roles": [
      "learner"
    ],
    "skills": [
      "rubric evaluation"
    ],
    "color": T.red
  },
  "fx-test-design-benchmark": {
    "tab": "Banking model benchmark",
    "name": "A leading Southeast Asian retail bank",
    "meta": "Model & product benchmark for FX test design · evaluated on AWS Bedrock × Google AI Studio",
    "verdict": "NO VERDICT",
    "summary": "A Southeast Asian retail bank selecting a vendor to automate test design for the foreign-exchange module of its mobile banking app. Seven contenders — five raw models and two packaged products — got the same brief: write a functional test suite from the bank's requirements document. Each suite was scored deterministically against a fixed requirements spine and by an independent judge.",
    "arch_stats": [
      [
        "7",
        "contenders"
      ],
      [
        "14",
        "in-scope FX journeys"
      ],
      [
        "21",
        "requirements traced"
      ],
      [
        "22",
        "currencies checked"
      ]
    ],
    "headline": [
      "7",
      "contenders benchmarked",
      "0.836",
      "top composite (4/5 criteria)",
      "0.823",
      "best on all 5 criteria",
      "NO VERDICT",
      "ranked leaderboard"
    ],
    "gates": [
      {
        "n": "Coverage completeness (leader)",
        "s": 0.921,
        "pass": null
      },
      {
        "n": "Requirement traceability (leader)",
        "s": 0.875,
        "pass": null
      },
      {
        "n": "Accuracy, independent judge (leader)",
        "s": 0.78,
        "pass": null
      },
      {
        "n": "Edge-case identification (leader)",
        "s": 0.748,
        "pass": null
      },
      {
        "n": "Self-report honesty (leader)",
        "s": 0.65,
        "pass": null
      },
      {
        "n": "Accuracy, largest-suite product",
        "s": 0.35,
        "pass": null,
        "note": "185 cases"
      }
    ],
    "finding": "Every contender covered nearly all the requirements, but they differed sharply on whether a case was actually correct and traceable. The commercial product that produced the most cases scored 0.35 on accuracy and cited a requirement in none of them. Models also over-reported their own coverage, and none of the sampled suites tested the future-order target-rate boundary.",
    "roles": [],
    "skills": [],
    "color": T.blue
  },
  "travel-support-reference": {
    "tab": "Travel support",
    "name": "A travel-booking support agent (reference build)",
    "meta": "Customer support · evaluated on an enterprise AI-search agent builder × Arize",
    "verdict": "NOT READY",
    "summary": "A customer-support agent for an Indian travel-booking brand, built in an enterprise AI-search vendor's agent builder as part of a platform evaluation. It answers cancellations, changes, baggage, payments, loyalty, documents and insurance questions from internal policy documents. The brand is a reference build, not a live customer deployment.",
    "arch_stats": [
      [
        "12",
        "intent categories"
      ],
      [
        "15",
        "evaluators"
      ],
      [
        "3",
        "online evaluators"
      ],
      [
        "5",
        "deployment gates"
      ]
    ],
    "headline": [
      "50",
      "cases evaluated",
      "0.853",
      "composite score",
      "1 of 5",
      "gates failed",
      "NOT READY",
      "verdict"
    ],
    "gates": [
      {
        "n": "Hallucination (grounded on no-result)",
        "s": 0.801,
        "pass": false,
        "note": "bar ≥0.90"
      },
      {
        "n": "Banned phrases / no config leak",
        "s": 1.0,
        "pass": true,
        "note": "bar =1.00"
      },
      {
        "n": "Safety classifier (scope + jailbreak)",
        "s": 0.906,
        "pass": true,
        "note": "bar ≥0.90"
      },
      {
        "n": "Intent / routing",
        "s": 0.986,
        "pass": true,
        "note": "bar ≥0.85"
      },
      {
        "n": "Policy adherence",
        "s": 0.86,
        "pass": true,
        "note": "bar ≥0.75"
      }
    ],
    "finding": "The agent answered all five off-topic requests — a weather forecast, a stock pick, opinions — instead of declining, and the hallucination gate failed at 0.801. It resisted both prompt-injection attempts and was honest when no policy existed. Escalation was weak, with only 2 of 5 handoff answers grounded.",
    "roles": [],
    "skills": [],
    "color": T.red
  },
  "bank-voice-agent-reference": {
    "tab": "Voice banking",
    "name": "A retail-bank support voice agent (reference build)",
    "meta": "Inbound voice support · evaluated on ElevenLabs × Arize",
    "verdict": "NOT READY",
    "summary": "A production-realistic retail-bank voice agent built on ElevenLabs Conversational AI to exercise the voice framework: balances, transfers, payments, PIN resets, card issues and disputes, with caller verification, mandatory read-backs of numbers and amounts, and fraud escalation to a human. Calls were driven by simulated callers; it is a reference build, not a client deployment.",
    "arch_stats": [
      [
        "29",
        "voice-call scenarios"
      ],
      [
        "21",
        "adversarial scenarios"
      ],
      [
        "6",
        "evaluation regions"
      ],
      [
        "12",
        "hard-stop gates"
      ]
    ],
    "headline": [
      "29",
      "calls evaluated",
      "0.821",
      "composite score",
      "1 of 12",
      "gates failed",
      "NOT_READY",
      "verdict"
    ],
    "gates": [
      {
        "n": "Mini-Miranda on debt calls",
        "s": 0.0,
        "pass": false,
        "note": "n=1"
      },
      {
        "n": "Fraud / distress escalation",
        "s": 1.0,
        "pass": true,
        "note": "n=2"
      },
      {
        "n": "Read-back before acting",
        "s": 1.0,
        "pass": true,
        "note": "n=3"
      },
      {
        "n": "No card number spoken in clear",
        "s": 1.0,
        "pass": true,
        "note": "n=1"
      },
      {
        "n": "AI disclosure at call open",
        "s": 1.0,
        "pass": true,
        "note": "n=2"
      },
      {
        "n": "No secret leak",
        "s": 1.0,
        "pass": true,
        "note": "n=29"
      }
    ],
    "finding": "The agent passed 11 of 12 compliance gates, but the failed debt-disclosure gate blocked deployment despite a Beta-range composite of 0.821. On 16 of 29 calls the voice platform's own analysis marked the call successful where the independent judge found a real failure. Examples include an unconfirmed payment amount and a dispute marked done when it was not.",
    "roles": [],
    "skills": [],
    "color": T.red
  },
  "institute-recruitment-screening": {
    "tab": "Public-sector hiring",
    "name": "A leading Indian public technical institute",
    "meta": "Recruitment screening workflow · evaluated on DevRev",
    "verdict": "NO VERDICT",
    "summary": "One of India's premier publicly funded engineering institutes screens job applicants through a DevRev workflow: mostly deterministic steps plus a single AI node that reads degree-certificate text and the parsed education table, then rules each applicant pass, fail or manual review on essential eligibility. With no human ground truth, each verdict was compared against an independent judge re-deriving it from the same evidence.",
    "arch_stats": [
      [
        "2",
        "screening workflows"
      ],
      [
        "1",
        "AI node per workflow"
      ],
      [
        "4,703",
        "records scanned for the cohort"
      ],
      [
        "47",
        "applications for the post"
      ]
    ],
    "headline": [
      "47",
      "applications evaluated",
      "46/47",
      "agreement with independent judge",
      "1",
      "divergence surfaced",
      "NO VERDICT",
      "verdict"
    ],
    "gates": [
      {
        "n": "Agreement with independent judge",
        "s": 0.979,
        "pass": null,
        "note": "46 / 47"
      },
      {
        "n": "Judge grounding against certificate text",
        "s": 1.0,
        "pass": null,
        "note": "0 ungrounded of 47"
      }
    ],
    "finding": "The AI node agreed with an independent judge on 46 of 47 applicants. On the one divergence it sent a holder of a qualifying three-year computer-applications degree to manual review, where the stated rule says pass. Stability was not truly measured on the full run, and only the essential-eligibility workflow was evaluated.",
    "roles": [],
    "skills": [],
    "color": T.blue
  },
};
