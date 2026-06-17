import React from "react";
import { T } from "../theme.js";

// Faithful inline reproduction of the evaluator's code-level architecture:
// Ingestion → API layer → DevRev integration + DevRev cloud → Evaluation engine
// → Observability → Arize / OpenAI. Built as a real diagram (not a screenshot).

const ZONE = {
  border: `1.5px dashed ${T.line}`, borderRadius: 16, padding: "30px 22px 22px",
  position: "relative", background: T.paperAlt,
};
const ZONE_LABEL = {
  position: "absolute", top: -10, right: 18, fontFamily: "IBM Plex Mono",
  fontSize: 10.5, letterSpacing: 1.2, textTransform: "uppercase", color: T.ink3,
  background: T.bg, padding: "1px 9px",
};

function Box({ title, sub, color = T.blue, solid }) {
  return (
    <div style={{
      flex: 1, minWidth: 150, background: solid ? `${color}0e` : T.paper,
      border: `1px solid ${solid ? color + "66" : T.line}`, borderRadius: 11,
      padding: "13px 15px", textAlign: "center",
    }}>
      <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 13.5, color }}>{title}</div>
      {sub && <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, color: T.ink3, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

function Flow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
      <div style={{ position: "relative", width: 2, height: 30, background: T.line, borderRadius: 2, overflow: "hidden" }}>
        <span style={{ position: "absolute", left: 0, width: 2, height: 10, borderRadius: 2, background: T.green, animation: "ae-flow 1.6s linear infinite" }} />
      </div>
    </div>
  );
}

const Row = ({ children }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} className="arch-row">{children}</div>
);

export default function ArchDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* INGESTION */}
      <div style={ZONE}>
        <span style={ZONE_LABEL}>Ingestion sources</span>
        <Row>
          <Box title="API" sub={"curl · runner CLI"} color={T.blue} />
          <Box title="Webhook" sub={"DevRev event push"} color={T.blue} />
          <Box title="Poller" sub={"60s background loop"} color={T.blue} />
        </Row>
      </div>
      <Flow />

      {/* API LAYER */}
      <div style={ZONE}>
        <span style={ZONE_LABEL}>API layer · api/v1/</span>
        <Row>
          <Box title="evaluate.py" sub={"/evaluate/query"} color={T.blue} />
          <Box title="webhook.py" sub={"HMAC verify · 200"} color={T.blue} />
          <Box title="results.py" sub={"/results/{run_id}"} color={T.blue} />
        </Row>
      </div>
      <Flow />

      {/* DEVREV INTEGRATION + EXTERNAL CLOUD */}
      <div className="arch-row" style={{ display: "flex", gap: 10 }}>
        <div style={{ ...ZONE, flex: 1.3 }}>
          <span style={ZONE_LABEL}>DevRev integration · services/devrev/</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Box title="client.py" sub={"SSE execute-sync"} color={T.green} />
            <Box title="discovery.py" sub={"agent ID lookup"} color={T.green} />
            <Box title="conversation.py" sub={"timeline parser"} color={T.green} />
            <Box title="poller.py" sub={"conversations.list"} color={T.green} />
          </div>
        </div>
        <div style={{ ...ZONE, flex: 1 }}>
          <span style={ZONE_LABEL}>External · DevRev cloud</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Box title="execute-sync" sub={"ai-agents.events"} color={T.red} solid />
            <Box title="timeline-entries" sub={"/timeline.list"} color={T.red} solid />
            <Box title="Target agent" sub={"ai_agent"} color={T.red} solid />
            <Box title="conversations" sub={"/conversations.list"} color={T.red} solid />
          </div>
        </div>
      </div>
      <Flow />

      {/* EVALUATION ENGINE */}
      <div style={{ ...ZONE, borderColor: `${T.green}88`, background: `${T.green}07` }}>
        <span style={{ ...ZONE_LABEL, color: T.green }}>Evaluation engine · services/evaluation/</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ background: `${T.green}12`, border: `1px solid ${T.green}55`, borderRadius: 11, padding: "13px 22px", textAlign: "center", maxWidth: 460 }}>
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 14, color: T.green }}>pipeline.py · run_evaluation_pipeline</div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, color: T.ink3, marginTop: 4 }}>EvalInput → spans → registry → log</div>
          </div>
          <div style={{ color: T.ink3 }}>↓</div>
          <div style={{ background: `${T.green}12`, border: `1px solid ${T.green}55`, borderRadius: 11, padding: "11px 22px", textAlign: "center" }}>
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 13.5, color: T.green }}>registry.run_all · asyncio.gather</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, width: "100%", marginTop: 4 }} className="arch-evals">
            {["brevity", "banned_phr", "intent", "policy", "halluc", "escalation", "safety",
              "correctness", "refusal", "groundedness", "consistency", "cx_quality", "tone", "language"].map((e) => (
              <div key={e} style={{ background: T.paper, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 6px", textAlign: "center", fontFamily: "IBM Plex Mono", fontSize: 10.5, color: T.ink2 }}>{e}</div>
            ))}
          </div>
        </div>
      </div>
      <Flow />

      {/* OBSERVABILITY */}
      <div style={ZONE}>
        <span style={ZONE_LABEL}>Observability · services/tracing/</span>
        <Row>
          <Box title="tracing/setup.py" sub={"OTel TracerProvider · OTLP HTTP"} color={T.amber} />
          <Box title="LLM judge calls" sub={"structured rubric · JSON"} color={T.amber} />
          <Box title="arize_logger.py" sub={"Arize SDK · run_in_executor"} color={T.amber} />
        </Row>
      </div>
      <Flow />

      {/* EXTERNAL ARIZE / OPENAI */}
      <div style={ZONE}>
        <span style={ZONE_LABEL}>External · Arize AX cloud · OpenAI</span>
        <Row>
          <Box title="Arize Traces" sub={"OTLP endpoint · span hierarchy · agent·tool·llm"} color={T.red} solid />
          <Box title="OpenAI" sub={"GPT-4o judges · 8 LLM evaluators"} color={T.red} solid />
          <Box title="Arize Predictions" sub={"SDK · features·tags · scorecards"} color={T.red} solid />
        </Row>
      </div>

      <style>{`
        @keyframes ae-flow { from { top: -10px; } to { top: 30px; } }
        @media (max-width: 820px){
          .arch-row{ flex-direction: column !important; }
          .arch-evals{ grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
