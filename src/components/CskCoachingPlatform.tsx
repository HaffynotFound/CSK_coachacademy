// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar } from "recharts";
import cskLogo from "@/assets/csk-academy-logo.png";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  gold:"#FFC72C", goldD:"rgba(255,199,44,0.55)", goldG:"rgba(255,199,44,0.18)",
  navy:"#EEF3FA", midnight:"#0A2547", card:"#FFFFFF", glass:"rgba(255,255,255,0.85)",
  white:"#0A2547", muted:"rgba(10,37,71,0.58)", faint:"rgba(10,37,71,0.10)",
  green:"#16A34A", red:"#EF4444", amber:"#F59E0B", blue:"#1F73D6",
  brand:"#1F73D6", brandD:"#0F4C9C",
};
const S = { // shared styles
  pill:(active)=>({ padding:"8px 16px", borderRadius:20, border:`1px solid ${active?C.gold:C.faint}`,
    background:active?C.goldG:C.card, color:active?C.brandD:C.muted,
    fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", letterSpacing:.5 }),
  btn:(variant="gold")=>({
    padding:"13px 0", width:"100%", border:"none", borderRadius:14, cursor:"pointer", fontSize:14,
    fontWeight:800, letterSpacing:.5,
    ...(variant==="gold"?{background:`linear-gradient(180deg,#FFD757,#FFB400)`,color:C.midnight,
      boxShadow:`0 10px 22px -8px rgba(255,180,0,.55),inset 0 -3px 0 rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.6)`}:{}),
    ...(variant==="blue"?{background:`linear-gradient(180deg,#2F86E8,#0F4C9C)`,color:"#FFFFFF",
      boxShadow:`0 10px 22px -8px rgba(15,76,156,.5),inset 0 -3px 0 rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.22)`}:{}),
    ...(variant==="ghost"?{background:C.card,border:`1px solid ${C.goldD}`,color:C.brandD,boxShadow:`0 4px 10px -6px rgba(15,76,156,.25)`}:{}),
    ...(variant==="danger"?{background:C.card,border:`1px solid rgba(239,68,68,.4)`,color:"#DC2626",boxShadow:`0 4px 10px -6px rgba(239,68,68,.3)`}:{}),
  }),
  card:{ background:C.card, border:`1px solid ${C.faint}`, borderRadius:18, padding:"14px 16px",
    boxShadow:`0 10px 28px -14px rgba(15,76,156,.22),0 2px 4px -2px rgba(15,76,156,.08),inset 0 1px 0 rgba(255,255,255,.9)` },
  input:{ width:"100%", background:"#F4F8FD", border:`1px solid ${C.faint}`, borderRadius:12,
    padding:"12px 14px", color:C.white, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    boxShadow:"inset 0 2px 4px rgba(10,37,71,.06)" },
  label:{ fontSize:9, color:C.muted, fontWeight:700, letterSpacing:2, display:"block", marginBottom:6 },
  h1:{ fontSize:24, fontWeight:900, color:C.white, fontFamily:"Impact,Arial Black,sans-serif", letterSpacing:1 },
  h2:{ fontSize:16, fontWeight:700, color:C.white },
  h3:{ fontSize:13, fontWeight:700, color:C.white },
  sub:{ fontSize:11, color:C.muted },
  sectionTitle:{ fontSize:9, color:C.muted, fontWeight:700, letterSpacing:2, marginBottom:10, marginTop:2 },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STUDENTS = [
  {id:1,name:"Deepak Chahar",initials:"DC",role:"Fast",avatar:"🏏",sessions:12,avgSpeed:138,topSpeed:142,economy:7.2},
  {id:2,name:"Tushar Deshpande",initials:"TD",role:"Fast-Medium",avatar:"🏏",sessions:9,avgSpeed:133,topSpeed:138,economy:8.1},
  {id:3,name:"Matheesha Pathirana",initials:"MP",role:"Fast",avatar:"🏏",sessions:14,avgSpeed:141,topSpeed:147,economy:6.8},
  {id:4,name:"Simarjeet Singh",initials:"SS",role:"Fast-Medium",avatar:"🏏",sessions:7,avgSpeed:129,topSpeed:134,economy:8.9},
  {id:5,name:"Ravindra Jadeja",initials:"RJ",role:"Spin",avatar:"🏏",sessions:11,avgSpeed:94,topSpeed:98,economy:6.1},
  {id:6,name:"Moeen Ali",initials:"MA",role:"Spin",avatar:"🏏",sessions:8,avgSpeed:90,topSpeed:95,economy:7.4},
];
const SESSIONS_DATA = [
  {id:1,name:"Pre-Match Nets",date:"27 May 2026",venue:"MA Chidambaram A",students:4,deliveries:56,status:"completed",duration:"1h 14m"},
  {id:2,name:"Morning Drills",date:"27 May 2026",venue:"MA Chidambaram B",students:3,deliveries:38,status:"ongoing",duration:"0h 42m"},
  {id:3,name:"Pace Specialists",date:"22 May 2026",venue:"Eden Gardens B",students:4,deliveries:62,status:"completed",duration:"1h 28m"},
  {id:4,name:"Spin Workshop",date:"20 May 2026",venue:"MA Chidambaram A",students:2,deliveries:41,status:"completed",duration:"0h 58m"},
  {id:5,name:"Recovery Session",date:"15 May 2026",venue:"Wankhede Nets",students:3,deliveries:29,status:"completed",duration:"0h 35m"},
];
const BALLS = [
  {id:1,speed:138,line:"Off stump",length:"Good length",swing:"Outswing",feedback:"Great seam position. High release point."},
  {id:2,speed:135,line:"Middle",length:"Full",swing:"Straight",feedback:"Slight drop in shoulder on release."},
  {id:3,speed:141,line:"Off stump",length:"Good length",swing:"Outswing",feedback:"Best ball — full extension, upright seam."},
  {id:4,speed:136,line:"Leg stump",length:"Short",swing:"Inswing",feedback:"Short run-up caused speed drop."},
  {id:5,speed:139,line:"Off stump",length:"Yorker",swing:"Outswing",feedback:"Perfect yorker. Wrist position ideal."},
  {id:6,speed:133,line:"Outside off",length:"Good length",swing:"Straight",feedback:"Over-pitched. Correctable."},
  {id:7,speed:140,line:"Off stump",length:"Good length",swing:"Outswing",feedback:"Excellent line and length combination."},
  {id:8,speed:137,line:"Middle",length:"Full",swing:"Inswing",feedback:"Good follow-through. Keep this action."},
];
const speedTrend = [{s:"Apr 1",v:134},{s:"Apr 15",v:136},{s:"May 1",v:135},{s:"May 8",v:137},{s:"May 15",v:138},{s:"May 22",v:139},{s:"May 27",v:141}];
const radarData = [{sub:"Pace",A:88},{sub:"Accuracy",A:76},{sub:"Seam",A:92},{sub:"Swing",A:70},{sub:"Yorker",A:85},{sub:"Economy",A:74}];
const barData = [{s:"Apr",v:136},{s:"May",v:138}];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Card = ({children,style={},onClick})=>(
  <div onClick={onClick} style={{...S.card,...style,cursor:onClick?"pointer":"default"}}>{children}</div>
);
const Badge = ({status})=>{
  const m={completed:{l:"COMPLETED",bg:"rgba(34,197,94,.12)",c:C.green,b:"rgba(34,197,94,.3)"},
    ongoing:{l:"● LIVE",bg:"rgba(239,68,68,.14)",c:C.red,b:"rgba(239,68,68,.35)"},
    pending:{l:"PENDING",bg:"rgba(245,158,11,.12)",c:C.amber,b:"rgba(245,158,11,.3)"},
    processing:{l:"PROCESSING",bg:"rgba(59,130,246,.12)",c:C.blue,b:"rgba(59,130,246,.3)"}};
  const t=m[status]||m.pending;
  return <span style={{fontSize:9,fontWeight:700,background:t.bg,color:t.c,border:`1px solid ${t.b}`,borderRadius:20,padding:"3px 9px",letterSpacing:.5,whiteSpace:"nowrap"}}>{t.l}</span>;
};
const Avatar = ({initials,size=42,active=false})=>(
  <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
    background:`radial-gradient(circle,#E1EDF9,${C.midnight})`,
    border:`2px solid ${active?C.gold:C.goldD}`,display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*.28,fontWeight:700,color:C.gold,
    boxShadow:active?`0 0 14px rgba(245,197,24,.4)`:undefined}}>{initials}</div>
);
const TopBar = ({title,onBack,right})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
    padding:"14px 18px 10px",flexShrink:0,borderBottom:`1px solid ${C.faint}`}}>
    {onBack
      ? <button onClick={onBack} style={{background:C.glass,border:`1px solid ${C.goldD}`,borderRadius:10,
          padding:"7px 10px",cursor:"pointer",color:C.white,lineHeight:1}}>
          <span style={{fontSize:16}}>←</span></button>
      : <div style={{width:36}}/>}
    <span style={{...S.h3,fontSize:15}}>{title}</span>
    {right||<div style={{width:36}}/>}
  </div>
);
const StatRow = ({label,value,sub,accent=false})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    padding:"8px 0",borderBottom:`1px solid ${C.faint}`}}>
    <span style={S.sub}>{label}</span>
    <span style={{fontSize:13,fontWeight:700,color:accent?C.gold:C.white,fontFamily:"monospace"}}>{value}
      {sub&&<span style={{fontSize:10,color:C.muted,fontWeight:400,marginLeft:4}}>{sub}</span>}</span>
  </div>
);
const BottomNav = ({tabs,active,onNav})=>(
  <div style={{position:"absolute",bottom:0,left:0,right:0,height:74,
    background:"rgba(255,255,255,.97)",borderTop:`1px solid ${C.goldD}`,
    display:"flex",alignItems:"center",padding:"0 8px 10px",zIndex:100}}>
    {tabs.map(t=>{
      const on=active===t.id;
      return <div key={t.id} onClick={()=>onNav(t.id)}
        style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",paddingTop:8}}>
        <span style={{fontSize:20}}>{t.icon}</span>
        <span style={{fontSize:9,color:on?C.gold:"rgba(10,37,71,.3)",fontWeight:on?700:400,letterSpacing:.5}}>{t.label.toUpperCase()}</span>
        {on&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gold}}/>}
      </div>;
    })}
  </div>
);
const Section = ({title,children,action})=>(
  <div style={{marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={S.sectionTitle}>{title}</span>
      {action&&<span onClick={action.fn} style={{fontSize:10,color:C.gold,cursor:"pointer",fontWeight:700}}>{action.label}</span>}
    </div>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════════════════════════════════
function Splash({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2400);return()=>clearTimeout(t);},[]);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:`radial-gradient(ellipse at 30% 20%,#FFFFFF,#DCE9F7)`,minHeight:"100%"}}>
      <div style={{width:170,height:170,borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%,#FFFFFF,#E8F0F8 70%)",
        display:"flex",alignItems:"center",justifyContent:"center",marginBottom:22,
        boxShadow:`0 30px 60px -20px rgba(15,76,156,.35),0 0 0 8px rgba(255,199,44,.18),inset 0 2px 0 rgba(255,255,255,.9)`}}>
        <img src={cskLogo} alt="CSK Academy" style={{width:130,height:130,objectFit:"contain",filter:"drop-shadow(0 6px 12px rgba(15,76,156,.25))"}}/>
      </div>
      <div style={{fontSize:11,color:C.brandD,letterSpacing:6,marginTop:2,fontWeight:800}}>COACHING PLATFORM</div>
      <div style={{marginTop:6,fontSize:12,color:C.muted,letterSpacing:3,fontWeight:700}}>BUILT FOR THE NEXT GENERATION</div>
      <div style={{marginTop:40,display:"flex",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:i===1?20:5,height:5,borderRadius:3,background:i===1?C.gold:C.goldD}}/>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function Login({onLogin}){
  const [role,setRole]=useState("coach");
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:`radial-gradient(ellipse at 50% 20%,#FFFFFF,#DCE9F7)`,
      minHeight:"100%",padding:"0 22px",overflowY:"auto",boxSizing:"border-box"}}>

      {/* Logo block — fully centred */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24}}>
        <div style={{width:110,height:110,borderRadius:"50%",
          background:"radial-gradient(circle at 38% 32%,#FFFFFF,#E8F0F8 70%)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 20px 44px -14px rgba(15,76,156,.30),0 0 0 6px rgba(255,199,44,.16),inset 0 2px 0 rgba(255,255,255,.9)`,
          marginBottom:14}}>
          <img src={cskLogo} alt="CSK Academy" style={{width:84,height:84,objectFit:"contain",
            display:"block",filter:"drop-shadow(0 4px 10px rgba(15,76,156,.22))"}}/>
        </div>
        <div style={{...S.h1,fontSize:26,letterSpacing:3,color:C.brandD,textAlign:"center"}}>COACHING</div>
        <div style={{fontSize:10,color:C.muted,letterSpacing:4,marginTop:3,fontWeight:700,textAlign:"center"}}>
          PERFORMANCE PLATFORM
        </div>
      </div>

      {/* Role toggle */}
      <div style={{display:"flex",width:"100%",background:C.card,borderRadius:14,
        border:`1px solid ${C.goldD}`,padding:4,marginBottom:18}}>
        {[{id:"coach",label:"🎯 Coach"},{id:"student",label:"🏏 Student"}].map(r=>(
          <button key={r.id} onClick={()=>setRole(r.id)} style={{flex:1,padding:"11px 0",
            background:role===r.id?C.gold:"transparent",border:"none",borderRadius:11,cursor:"pointer",
            color:role===r.id?C.midnight:C.muted,fontSize:13,fontWeight:700,textTransform:"uppercase",
            letterSpacing:1.5,transition:"all .2s"}}>{r.label}</button>
        ))}
      </div>

      {/* Credentials */}
      <Card style={{marginBottom:14,width:"100%",boxSizing:"border-box"}}>
        <label style={S.label}>EMAIL</label>
        <input placeholder={role==="coach"?"coach@csk.in":"deepak@csk.in"} style={S.input}/>
        <label style={{...S.label,marginTop:14}}>PASSWORD</label>
        <input type="password" placeholder="••••••••" style={S.input}/>
      </Card>

      <button onClick={()=>onLogin(role)} style={{...S.btn(),width:"100%"}}>Sign In →</button>

      <div style={{textAlign:"center",marginTop:14,paddingBottom:10}}>
        <span style={S.sub}>Forgot password? </span>
        <span style={{fontSize:12,color:C.gold,cursor:"pointer",fontWeight:600}}>Reset</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — HOME DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function CoachHome({onNav}){
  const ongoing=SESSIONS_DATA.filter(s=>s.status==="ongoing");
  const completed=SESSIONS_DATA.filter(s=>s.status==="completed");
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      {/* Header */}
      <div style={{background:`radial-gradient(ellipse at 20% 30%,#DCE9F7,${C.midnight})`,
        padding:"52px 20px 20px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-20,right:-20,fontSize:120,opacity:.04,lineHeight:1}}>🦁</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>👋 Welcome back</div>
        <div style={S.h1}>Coach Dhruv</div>
        <div style={S.sub}>27 May 2026 · Chepauk</div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          {[{l:"Total Students",v:STUDENTS.length},{l:"Sessions",v:SESSIONS_DATA.length},{l:"Live Now",v:ongoing.length}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(10,37,71,.06)",borderRadius:12,
              border:`1px solid ${C.goldD}`,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:s.l==="Live Now"?C.red:C.gold}}>{s.v}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:2,fontWeight:600,letterSpacing:.5}}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <button onClick={()=>onNav("createSession")} style={{...S.btn(),flex:2}}>+ New Session</button>
          <button onClick={()=>onNav("uploadVideo")} style={{...S.btn("ghost"),flex:1}}>📤 Upload</button>
        </div>

        {/* Live sessions */}
        {ongoing.length>0&&(
          <Section title="🔴 LIVE SESSIONS">
            {ongoing.map(s=>(
              <Card key={s.id} style={{marginBottom:10,borderLeft:`3px solid ${C.red}`}} onClick={()=>onNav("sessionDetail",s)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={S.h3}>{s.name}</span><Badge status={s.status}/>
                </div>
                <div style={{display:"flex",gap:12}}>
                  <span style={S.sub}>{s.venue}</span>
                  <span style={S.sub}>· {s.students} students · {s.deliveries} balls</span>
                </div>
                <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.faint}`,
                  fontSize:11,color:C.gold,fontWeight:700}}>Tap to manage →</div>
              </Card>
            ))}
          </Section>
        )}

        {/* Recent completed */}
        <Section title="RECENT SESSIONS" action={{label:"View all",fn:()=>onNav("sessions")}}>
          {completed.slice(0,3).map(s=>(
            <Card key={s.id} style={{marginBottom:10}} onClick={()=>onNav("sessionDetail",s)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={S.h3}>{s.name}</span><Badge status={s.status}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <span style={S.sub}>{s.date}</span>
                <span style={S.sub}>· {s.venue}</span>
                <span style={S.sub}>· {s.students} students</span>
              </div>
            </Card>
          ))}
        </Section>

        {/* Students */}
        <Section title="MY STUDENTS" action={{label:"View all",fn:()=>onNav("students")}}>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
            {STUDENTS.slice(0,5).map(s=>(
              <div key={s.id} onClick={()=>onNav("studentReport",s)}
                style={{minWidth:76,background:C.card,border:`1px solid ${C.goldD}`,borderRadius:14,
                  padding:"12px 8px",textAlign:"center",cursor:"pointer",flexShrink:0}}>
                <Avatar initials={s.initials} size={38}/>
                <div style={{fontSize:10,fontWeight:700,color:C.white,marginTop:6,lineHeight:1.3}}>{s.name.split(" ")[0]}</div>
                <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.role}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <BottomNav active="home" onNav={(id)=>onNav(id)}
        tabs={[{id:"home",icon:"🏠",label:"Home"},{id:"sessions",icon:"📋",label:"Sessions"},
          {id:"students",icon:"👥",label:"Students"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — CREATE SESSION
// ═══════════════════════════════════════════════════════════════════════════════
function CreateSession({onBack,onNav}){
  const [step,setStep]=useState(0); // 0=details, 1=students, 2=confirm
  const [name,setName]=useState("Net Session · 27 May");
  const [venue,setVenue]=useState("MA Chidambaram Nets A");
  const [date,setDate]=useState("2026-05-27");
  const [selected,setSelected]=useState([1,2,3]);
  const [cameraMode,setCameraMode]=useState(3);
  const toggle=(id)=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const venues=["MA Chidambaram Nets A","MA Chidambaram Nets B","Eden Gardens Nets B","Wankhede Nets"];
  const steps=["Details","Students","Confirm"];

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Create Session" onBack={onBack}/>
      {/* Stepper */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,padding:"14px 0 10px",flexShrink:0}}>
        {steps.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:700,
                background:i<step?C.green:i===step?C.gold:"rgba(10,37,71,.07)",
                color:i<=step?C.midnight:"rgba(10,37,71,.3)",
                boxShadow:i===step?`0 0 12px rgba(245,197,24,.5)`:undefined,
                border:i>step?`1px solid ${C.goldD}`:undefined}}>
                {i<step?"✓":i+1}</div>
              <span style={{fontSize:9,color:i===step?C.gold:i<step?C.green:"rgba(10,37,71,.3)",fontWeight:i===step?700:400}}>{s}</span>
            </div>
            {i<steps.length-1&&<div style={{width:32,height:1,background:i<step?C.green:C.goldD,margin:"0 4px",marginBottom:14}}/>}
          </div>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"4px 18px 24px"}}>
        {step===0&&(
          <>
            <label style={S.label}>SESSION NAME</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{...S.input,marginBottom:14}}/>
            <label style={S.label}>VENUE</label>
            <select value={venue} onChange={e=>setVenue(e.target.value)}
              style={{...S.input,marginBottom:14,background:"rgba(255,255,255,.95)",colorScheme:"dark",cursor:"pointer"}}>
              {venues.map(v=><option key={v}>{v}</option>)}
            </select>
            <label style={S.label}>DATE</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              style={{...S.input,marginBottom:20,colorScheme:"dark"}}/>
            <label style={S.label}>CAMERA SETUP</label>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              {[{v:1,icon:"🎥",label:"1 Camera",sub:"Umpire View"},{v:3,icon:"📸",label:"3 Cameras",sub:"Full multi-angle"}].map(m=>(
                <div key={m.v} onClick={()=>setCameraMode(m.v)}
                  style={{...S.card,flex:1,textAlign:"center",cursor:"pointer",padding:"14px 8px",
                    border:`1.5px solid ${cameraMode===m.v?C.gold:C.goldD}`,
                    background:cameraMode===m.v?C.goldG:C.card}}>
                  <div style={{fontSize:24,marginBottom:6}}>{m.icon}</div>
                  <div style={{fontSize:12,fontWeight:700,color:cameraMode===m.v?C.brandD:C.white}}>{m.label}</div>
                  <div style={{fontSize:9,color:C.muted,marginTop:2}}>{m.sub}</div>
                  {cameraMode===m.v&&<div style={{width:6,height:6,borderRadius:"50%",background:C.gold,margin:"6px auto 0"}}/>}
                </div>
              ))}
            </div>
            <button onClick={()=>setStep(1)} style={S.btn()}>Next: Add Students →</button>
          </>
        )}
        {step===1&&(
          <>
            <div style={{...S.sub,marginBottom:12}}>Select students for this session ({selected.length} selected)</div>
            {STUDENTS.map(s=>{
              const on=selected.includes(s.id);
              return(
                <div key={s.id} onClick={()=>toggle(s.id)} style={{...S.card,marginBottom:10,cursor:"pointer",
                  border:`1px solid ${on?C.gold:C.goldD}`,background:on?C.goldG:C.glass}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Avatar initials={s.initials} size={40} active={on}/>
                    <div style={{flex:1}}>
                      <div style={S.h3}>{s.name}</div>
                      <div style={S.sub}>{s.role} · {s.sessions} sessions</div>
                    </div>
                    <div style={{width:22,height:22,borderRadius:"50%",
                      background:on?C.gold:"rgba(10,37,71,.07)",border:`2px solid ${on?C.gold:C.goldD}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:12,color:on?C.midnight:C.muted,fontWeight:700}}>
                      {on?"✓":""}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button onClick={()=>setStep(0)} style={{...S.btn("ghost"),flex:1}}>← Back</button>
              <button onClick={()=>setStep(2)} style={{...S.btn(),flex:2}}>Review →</button>
            </div>
          </>
        )}
        {step===2&&(
          <>
            <Card style={{marginBottom:14}}>
              <div style={{...S.h3,marginBottom:10,color:C.gold}}>Session Summary</div>
              <StatRow label="Name" value={name}/>
              <StatRow label="Venue" value={venue}/>
              <StatRow label="Date" value={date}/>
              <StatRow label="Students" value={selected.length} accent/>
              <StatRow label="Camera Mode" value={cameraMode===3?"3 Cameras · Multi-angle":"1 Camera · Side-on"}/>
            </Card>
            <div style={{...S.sectionTitle}}>SELECTED STUDENTS</div>
            {STUDENTS.filter(s=>selected.includes(s.id)).map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Avatar initials={s.initials} size={36} active/>
                <div>
                  <div style={S.h3}>{s.name}</div>
                  <div style={S.sub}>{s.role}</div>
                </div>
              </div>
            ))}
            <div style={{height:16}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(1)} style={{...S.btn("ghost"),flex:1}}>← Back</button>
              <button onClick={()=>{
                SESSION.selectedStudentIds=[...selected];
                SESSION.sessionName=name;
                SESSION.venue=venue;
                SESSION.date=date;
                SESSION.cameraMode=cameraMode;
                SESSION.ballsLogged=[];
                SESSION.calibrationPts=[];
                onNav("sessionCalibration",{cameraMode});
              }} style={{...S.btn(),flex:2}}>Start Session →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — RECORD SESSION (live recording flow)
// ═══════════════════════════════════════════════════════════════════════════════
function RecordSession({onBack,onNav}){
  const [activeStu,setActiveStu]=useState(STUDENTS[0]);
  const [isRec,setIsRec]=useState(false);
  const [timer,setTimer]=useState(0);
  const timerRef=useRef(null);
  const liveStuRef=useRef(activeStu);
  liveStuRef.current=activeStu;

  useEffect(()=>{
    if(isRec){timerRef.current=setInterval(()=>setTimer(p=>p+1),1000);}
    else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[isRec]);

  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleStop=()=>{
    setIsRec(false);
    clearInterval(timerRef.current);
    SESSION._pendingStuId=liveStuRef.current.id;
    onNav("coachingNote");
  };

  const selectedStudents=STUDENTS.filter(s=>SESSION.selectedStudentIds.includes(s.id));
  const cm=SESSION.cameraMode||1;
  const angles=CAMERA_ANGLES[cm]||CAMERA_ANGLES[1];
  const ballsThisStu=SESSION.ballsLogged.filter(b=>b.student===activeStu.initials).length;
  const multi=angles.length>1;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:0,position:"relative"}}>
      {/* Thin top bar */}
      <div style={{background:`radial-gradient(ellipse at 20% 30%,#DCE9F7,${C.midnight})`,
        padding:"48px 16px 6px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={S.sub}>{SESSION.sessionName||"Recording"}</div>
          <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:C.gold}}>{fmt(timer)}</div>
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {selectedStudents.map(s=>{
            const on=s.id===activeStu.id;
            return(
              <div key={s.id} onClick={()=>setActiveStu(s)}
                style={{flexShrink:0,background:on?C.goldG:C.card,border:`1px solid ${on?C.gold:C.goldD}`,
                  borderRadius:10,padding:"5px 10px",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                <Avatar initials={s.initials} size={24} active={on}/>
                <span style={{fontSize:10,fontWeight:700,color:on?C.brandD:C.muted}}>{s.initials}</span>
                <span style={{fontSize:8,color:C.muted}}>{SESSION.ballsLogged.filter(b=>b.student===s.initials).length}b</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Camera section — nested flexbox with minHeight:0 on every child */}
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:3,
        margin:"4px 10px 6px",overflow:"hidden",minHeight:0}}>
        {angles.map((cam,idx)=>
          <div key={cam.id} style={{flex:1,minHeight:0,borderRadius:14,overflow:"hidden",position:"relative",
            background:`radial-gradient(ellipse at 50% 40%,#E8F0F8,#111)`,
            border:`2px solid ${isRec?"rgba(239,68,68,.65)":C.goldD}`,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            {isRec&&idx===0&&(
              <div style={{position:"absolute",top:8,left:10,display:"flex",alignItems:"center",gap:5,
                background:"rgba(0,0,0,.65)",borderRadius:20,padding:"3px 10px",zIndex:10}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.red,animation:"blink 1s infinite"}}/>
                <span style={{fontFamily:"monospace",fontSize:10,fontWeight:700,color:"#fff"}}>REC {fmt(timer)}</span>
              </div>
            )}
            <div style={{position:"absolute",top:8,right:10,background:"rgba(0,0,0,.6)",
              borderRadius:20,padding:"3px 10px",zIndex:10}}>
              <span style={{fontSize:9,fontWeight:700,color:C.gold}}>{cam.icon} {cam.label}</span>
            </div>
            <div style={{textAlign:"center",opacity:.25}}>
              <div style={{fontSize:multi?24:50,color:C.muted}}>{cam.icon}</div>
              {!multi&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>Camera Preview</div>}
            </div>
          </div>
        )}
      </div>

      {/* Record button */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 0 14px",flexShrink:0}}>
        <button onClick={()=>isRec?handleStop():setIsRec(true)} style={{
          width:80,height:80,borderRadius:"50%",background:C.midnight,cursor:"pointer",
          border:`4px solid ${isRec?C.red:C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:isRec?`0 0 32px rgba(239,68,68,.6)`:`0 0 32px rgba(245,197,24,.6)`,marginBottom:6}}>
          <div style={{width:54,height:54,borderRadius:isRec?14:"50%",
            background:isRec?C.red:C.gold,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
            {isRec
              ?<div style={{width:16,height:16,borderRadius:2,background:"#fff"}}/>
              :<div style={{width:18,height:18,borderRadius:"50%",background:C.midnight}}/>}
          </div>
        </button>
        <span style={{...S.sub,fontSize:11}}>{isRec?"Tap to stop":"Tap to start recording"}</span>
        <span style={{fontSize:9,color:C.muted,marginTop:2}}>{SESSION.ballsLogged.length} balls logged this session</span>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION CALIBRATION — Trapezoid (4 corners) + Stumps (6 markers)
// ═══════════════════════════════════════════════════════════════════════════════
function SessionCalibration({onBack,onNav}){
  const [phase,setPhase]=useState('corners');
  const [corners,setCorners]=useState([]);
  const [stumps,setStumps]=useState({bat:[],bowl:[]});
  const [drag,setDrag]=useState(null);
  const svgRef=useRef(null);
  const liveRef=useRef({corners,stumps,phase});
  useEffect(()=>{liveRef.current={corners,stumps,phase};},[corners,stumps,phase]);

  const CORNER_LABELS=['BL','BR','TR','TL'];
  const CORNER_COLORS=['#22c55e','#3b82f6','#a855f7','#f59e0b'];
  const STUMP_SEQ=[
    {side:'bat',label:'Bat·Off'},
    {side:'bat',label:'Bat·Mid'},
    {side:'bat',label:'Bat·Leg'},
    {side:'bowl',label:'Bowl·Off'},
    {side:'bowl',label:'Bowl·Mid'},
    {side:'bowl',label:'Bowl·Leg'},
  ];
  const STUMP_LABELS=['Off','Mid','Leg'];

  const cornersDone=corners.length===4;
  const stumpsAll=stumps.bat.concat(stumps.bowl);
  const stumpsPlaced=stumpsAll.length;
  const stumpsDone=stumpsPlaced===6;
  const allDone=cornersDone&&stumpsDone;

  const pc=(e)=>{
    if(!svgRef.current)return null;
    const r=svgRef.current.getBoundingClientRect();
    return {x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100};
  };

  const hitDist=(a,b)=>{
    if(!svgRef.current)return Infinity;
    const r=svgRef.current.getBoundingClientRect();
    const dx=(a.x-b.x)*r.width/100;
    const dy=(a.y-b.y)*r.height/100;
    return Math.sqrt(dx*dx+dy*dy);
  };

  const findHit=(px,py)=>{
    const pt={x:px,y:py};
    for(let i=0;i<corners.length;i++){
      if(hitDist(corners[i],pt)<8)return{type:'corner',idx:i};
    }
    for(const side of['bat','bowl']){
      for(let i=0;i<stumps[side].length;i++){
        if(hitDist(stumps[side][i],pt)<8)return{type:'stump',side,idx:i};
      }
    }
    return null;
  };

  const onDown=(e)=>{
    if(e.button!==0||allDone)return;
    e.stopPropagation();
    const p=pc(e);
    if(!p)return;
    const hit=findHit(p.x,p.y);
    if(hit){
      setDrag({...hit,pointerId:e.pointerId,origX:p.x,origY:p.y});
      try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}
      return;
    }
    if(phase==='corners'&&!cornersDone){
      setCorners(prev=>{const n=[...prev,p];return n;});
    }else if(phase==='stumps'&&!stumpsDone){
      const side=STUMP_SEQ[stumpsPlaced].side;
      setStumps(prev=>{
        const n={bat:[...prev.bat],bowl:[...prev.bowl]};
        n[side].push(p);
        return n;
      });
    }
  };

  const onMove=(e)=>{
    if(!drag||drag.pointerId!==e.pointerId)return;
    const p=pc(e);
    if(!p)return;
    if(drag.type==='corner'){
      setCorners(prev=>{const n=[...prev];n[drag.idx]=p;return n;});
    }else{
      setStumps(prev=>{
        const n={bat:[...prev.bat],bowl:[...prev.bowl]};
        n[drag.side][drag.idx]=p;
        return n;
      });
    }
  };

  const onUp=(e)=>{
    if(!drag||drag.pointerId!==e.pointerId)return;
    try{e.currentTarget.releasePointerCapture(e.pointerId);}catch{}
    setDrag(null);
  };

  useEffect(()=>{
    if(phase==='corners'&&cornersDone)setPhase('stumps');
  },[phase,cornersDone]);

  const saveCalibration=()=>{
    SESSION.calibrationPts={corners,stumps};
    onNav("recordSession",{cameraMode:SESSION.cameraMode});
  };

  const polyPoints=corners.map(p=>`${p.x},${p.y}`).join(' ');

  const hasAny=corners.length>0||stumpsPlaced>0;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Pitch Calibration" onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 24px"}}>
        <div style={{padding:"10px 14px",background:"rgba(31,115,214,.06)",
          border:"1px solid rgba(31,115,214,.2)",borderRadius:12,marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.brand,marginBottom:3}}>
            {phase==='corners'?'📍 Step 1: Mark pitch corners':'🎯 Step 2: Mark stumps'}
          </div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>
            {phase==='corners'
              ?`Click 4 corners in order: BL → BR → TR → TL (${corners.length}/4)`
              :`Click 6 stumps: Off → Mid → Leg at both ends (${stumpsPlaced}/6)`
            }
            {allDone&&' All markers placed — drag to refine, then save.'}
          </div>
        </div>

        <div style={{position:"relative",width:"100%",height:256,borderRadius:16,
          background:"linear-gradient(180deg,#4ade80 0%,#16a34a 35%,#166534 65%,#4ade80 100%)",
          border:`2px solid ${C.goldD}`,overflow:"hidden",marginBottom:12,
          boxShadow:"0 8px 24px -8px rgba(10,37,71,.3)"}}>
          <div style={{position:"absolute",left:"50%",top:"5%",transform:"translateX(-50%)",
            width:"26%",height:"90%",background:"linear-gradient(180deg,#d4a96a,#c49252)",
            borderRadius:4,border:"1px solid rgba(255,255,255,.25)",pointerEvents:"none",zIndex:0}}/>
          {["17%","81%"].map(t=>(
            <div key={t} style={{position:"absolute",left:"50%",top:t,transform:"translateX(-50%)",
              width:"36%",height:2,background:"rgba(255,255,255,.8)",pointerEvents:"none",zIndex:0}}/>
          ))}
          {["13%","85%"].map(t=>(
            <div key={t} style={{position:"absolute",left:"50%",top:t,transform:"translateX(-50%)",
              display:"flex",gap:5,pointerEvents:"none",zIndex:0}}>
              {[0,1,2].map(j=><div key={j} style={{width:3,height:16,background:"#f8f8f8",borderRadius:2,pointerEvents:"none"}}/>)}
            </div>
          ))}

          <svg ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1,
              cursor:allDone?"default":"crosshair",touchAction:"none"}}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <rect x={0} y={0} width={100} height={100} fill="transparent"/>

            {corners.length===4&&(
              <polygon points={polyPoints} fill="#22c55e" fillOpacity={0.12} stroke="none"/>
            )}
            {corners.length>=2&&(
              <polyline points={polyPoints+(cornersDone?` ${corners[0].x},${corners[0].y}`:'')}
                fill="none" stroke="#22c55e" strokeWidth={0.6}/>
            )}

            {corners.map((p,i)=>(
              <g key={`c${i}`}>
                <circle cx={p.x} cy={p.y} r={2.2} fill={CORNER_COLORS[i]} stroke="white" strokeWidth={0.5} style={{cursor:'move'}}/>
                <text x={p.x+3} y={p.y-2} fill={CORNER_COLORS[i]} fontSize={3.5} fontWeight={700}
                  stroke="black" strokeWidth={1.5} paintOrder="stroke">{CORNER_LABELS[i]}</text>
              </g>
            ))}

            {['bat','bowl'].map(side=>stumps[side].map((p,i)=>(
              <g key={`${side}${i}`}>
                <circle cx={p.x} cy={p.y} r={1} fill={side==='bat'?'#fde047':'#fbbf24'} stroke="white" strokeWidth={0.2} style={{cursor:'move'}}/>
                <text x={p.x+2.5} y={p.y-1.5} fill={side==='bat'?'#fde047':'#fbbf24'} fontSize={3} fontWeight={600}
                  stroke="black" strokeWidth={1.2} paintOrder="stroke">{side==='bat'?'B':'W'}·{STUMP_LABELS[i]}</text>
              </g>
            )))}

            {stumpsDone&&[0,1,2].map(i=>{
              const bat=stumps.bat[i];const bowl=stumps.bowl[i];
              if(!bat||!bowl)return null;
              return(
                <line key={`sl${i}`} x1={bat.x} y1={bat.y} x2={bowl.x} y2={bowl.y}
                  stroke="#facc15" strokeWidth={0.5} strokeDasharray="2 1.5" opacity={0.6}/>
              );
            })}

            {!cornersDone&&(
              <text x={2} y={96} fill="#22c55e" fontSize={4.5} fontWeight={700}
                stroke="black" strokeWidth={1.5} paintOrder="stroke">
                Click {CORNER_LABELS[corners.length]} corner ({corners.length}/4)
              </text>
            )}
            {cornersDone&&!stumpsDone&&(
              <text x={2} y={96} fill="#fde047" fontSize={4.5} fontWeight={700}
                stroke="black" strokeWidth={1.5} paintOrder="stroke">
                Click {STUMP_SEQ[stumpsPlaced].label} stump ({stumpsPlaced}/6)
              </text>
            )}
            {allDone&&(
              <text x={50} y={96} textAnchor="middle" fill="#10b981" fontSize={4.5} fontWeight={700}
                stroke="black" strokeWidth={1.5} paintOrder="stroke">
                ✓ Done — drag to adjust, then Save
              </text>
            )}
          </svg>
        </div>

        {hasAny&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            {corners.map((p,i)=>(
              <div key={`cl${i}`} style={{display:"flex",alignItems:"center",gap:5,
                background:C.card,border:`1px solid ${CORNER_COLORS[i]}55`,borderRadius:20,padding:"4px 10px"}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:CORNER_COLORS[i],
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:"#fff"}}>
                  {CORNER_LABELS[i]}
                </div>
                <span style={{fontSize:9,color:C.white,fontWeight:600}}>Corner</span>
              </div>
            ))}
            {stumps.bat.map((p,i)=>(
              <div key={`bs${i}`} style={{display:"flex",alignItems:"center",gap:5,
                background:C.card,border:"1px solid #fde04755",borderRadius:20,padding:"3px 8px"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:"#fde047",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"#222"}}>
                  B
                </div>
                <span style={{fontSize:8,color:C.white,fontWeight:600}}>Bat·{STUMP_LABELS[i]}</span>
              </div>
            ))}
            {stumps.bowl.map((p,i)=>(
              <div key={`ws${i}`} style={{display:"flex",alignItems:"center",gap:5,
                background:C.card,border:"1px solid #fbbf2455",borderRadius:20,padding:"3px 8px"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:"#fbbf24",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:6,fontWeight:700,color:"#222"}}>
                  W
                </div>
                <span style={{fontSize:8,color:C.white,fontWeight:600}}>Bowl·{STUMP_LABELS[i]}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          {hasAny&&(
            <button onClick={()=>{setCorners([]);setStumps({bat:[],bowl:[]});setPhase('corners');}}
              style={{...S.btn("ghost"),flex:1}}>Reset All</button>
          )}
          <button onClick={saveCalibration} disabled={!allDone}
            style={{...S.btn(allDone?"gold":"ghost"),flex:allDone?2:1,
              opacity:allDone?1:.4,cursor:allDone?"pointer":"not-allowed"}}>
            Save Calibration →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACHING NOTE (separate page with voice recording)
// ═══════════════════════════════════════════════════════════════════════════════
function CoachingNote({onBack,onNav,studentId}){
  const sid=studentId??SESSION._pendingStuId;
  const student=STUDENTS.find(s=>s.id===sid)||STUDENTS[0];
  useEffect(()=>{SESSION._pendingStuId=undefined;},[]);
  const [note,setNote]=useState("");
  const [mediaRecorder,setMediaRecorder]=useState(null);
  const [audioChunks,setAudioChunks]=useState([]);
  const [isRecordingVoice,setIsRecordingVoice]=useState(false);
  const [audioUrl,setAudioUrl]=useState(null);
  const [voiceDuration,setVoiceDuration]=useState(0);
  const voiceTimerRef=useRef(null);
  const streamRef=useRef(null);

  useEffect(()=>{
    return()=>{
      if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
      if(voiceTimerRef.current)clearInterval(voiceTimerRef.current);
    };
  },[]);

  const startVoiceRecording=async()=>{
    try{
      const s=await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current=s;
      const recorder=new MediaRecorder(s);
      const chunks=[];
      recorder.ondataavailable=e=>chunks.push(e.data);
      recorder.onstop=()=>{
        const blob=new Blob(chunks,{type:"audio/webm"});
        setAudioUrl(URL.createObjectURL(blob));
        setAudioChunks(chunks);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      voiceTimerRef.current=setInterval(()=>setVoiceDuration(p=>p+1),1000);
    }catch(e){console.error("Mic access denied",e);}
  };

  const stopVoiceRecording=()=>{
    if(mediaRecorder&&mediaRecorder.state!=="inactive"){
      mediaRecorder.stop();
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
      if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
    }
  };

  const fmtVoice=(s)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  const handleSave=()=>{
    SESSION.ballsLogged=[...SESSION.ballsLogged,{
      id:SESSION.ballsLogged.length+1,
      student:student.initials,
      studentId:student.id,
      speed:Math.floor(Math.random()*12+132),
      note:note||undefined,
      audioUrl:audioUrl||undefined,
    }];
    onNav("sessionReview");
  };

  const handleSkip=()=>{
    SESSION.ballsLogged=[...SESSION.ballsLogged,{
      id:SESSION.ballsLogged.length+1,
      student:student.initials,
      studentId:student.id,
      speed:Math.floor(Math.random()*12+132),
    }];
    onNav("sessionReview");
  };

  const ballNum=SESSION.ballsLogged.length+1;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Coaching Note" onBack={onBack}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 20px 32px"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:40,marginBottom:10}}>📝</div>
          <div style={S.h2}>Add a note for {student.name}?</div>
          <div style={{...S.sub,marginTop:4}}>Ball #{ballNum} · {student.role}</div>
        </div>

        {/* Voice note recorder */}
        <Card style={{marginBottom:14}}>
          <label style={S.label}>VOICE NOTE</label>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0"}}>
            {!isRecordingVoice&&!audioUrl&&(
              <button onClick={startVoiceRecording} style={{width:48,height:48,borderRadius:"50%",
                background:C.goldG,border:`1px solid ${C.goldD}`,cursor:"pointer",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:20}}>🎙️</span>
              </button>
            )}
            {isRecordingVoice&&(
              <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:C.red,animation:"blink 1s infinite"}}/>
                <span style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:C.red}}>{fmtVoice(voiceDuration)}</span>
                <button onClick={stopVoiceRecording} style={{marginLeft:"auto",padding:"8px 16px",
                  background:C.red,border:"none",borderRadius:10,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  Stop
                </button>
              </div>
            )}
            {audioUrl&&!isRecordingVoice&&(
              <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                <audio src={audioUrl} controls style={{height:32,flex:1}}/>
                <button onClick={()=>{setAudioUrl(null);setAudioChunks([]);}}
                  style={{background:"transparent",border:`1px solid ${C.goldD}`,borderRadius:8,
                    padding:"6px 10px",fontSize:10,cursor:"pointer",color:C.muted}}>
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
          <div style={{fontSize:9,color:C.muted,marginTop:6}}>
            {audioUrl?"Voice note recorded ✓":"Tap the mic to record a voice note"}
          </div>
        </Card>

        {/* Text note */}
        <Card style={{marginBottom:16}}>
          <label style={S.label}>TEXT NOTE</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)}
            placeholder="e.g. Good seam position, work on follow-through…"
            rows={4} style={{...S.input,resize:"none",lineHeight:1.6,height:90}}/>
        </Card>

        <button onClick={handleSave} style={{...S.btn(),marginBottom:10}}>Save Note →</button>
        <button onClick={handleSkip} style={S.btn("ghost")}>Skip</button>
        <button onClick={()=>onNav("recordSession")} style={{...S.btn("ghost"),marginTop:6,color:C.red,borderColor:"rgba(220,38,38,.3)"}}>Delete Video</button>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION REVIEW — bowler slides with ball videos
// ═══════════════════════════════════════════════════════════════════════════════
function SessionReview({onNav}){
  const [openBowler,setOpenBowler]=useState(null);
  const [balls,setBalls]=useState([...SESSION.ballsLogged]);

  const selectedStudents=STUDENTS.filter(s=>SESSION.selectedStudentIds.includes(s.id));

  const deleteBall=(ballId)=>{
    SESSION.ballsLogged=SESSION.ballsLogged.filter(b=>b.id!==ballId);
    setBalls([...SESSION.ballsLogged]);
  };

  const bowlerBalls=(student)=>{
    return balls.filter(b=>b.student===student.initials);
  };

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Review Session"/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 16px"}}>
        <div style={{marginBottom:14}}>
          <span style={S.h2}>{SESSION.sessionName}</span>
          <div style={S.sub}>{SESSION.venue} · {SESSION.date} · {balls.length} balls</div>
        </div>

        <div style={{...S.sectionTitle}}>BOWLERS</div>
        {selectedStudents.map(st=>{
          const bws=bowlerBalls(st);
          const isOpen=openBowler===st.id;
          return(
            <Card key={st.id} style={{marginBottom:10,overflow:"hidden"}}>
              <div onClick={()=>setOpenBowler(isOpen?null:st.id)}
                style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <Avatar initials={st.initials} size={40}/>
                <div style={{flex:1}}>
                  <div style={S.h3}>{st.name}</div>
                  <div style={S.sub}>{bws.length} ball{bws.length!==1?"s":""} bowled</div>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:C.gold,fontFamily:"monospace",marginRight:4}}>
                  {bws.length}
                </div>
                <span style={{fontSize:14,color:C.muted,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
              </div>

              {isOpen&&(
                <div style={{marginTop:10,borderTop:`1px solid ${C.faint}`,paddingTop:10}}>
                  {bws.length===0&&(
                    <div style={{...S.sub,textAlign:"center",padding:"12px 0",fontSize:11}}>No balls recorded for this bowler</div>
                  )}
                  {bws.map(b=>(
                    <div key={b.id} style={{marginBottom:8,padding:"10px 12px",
                      background:"rgba(10,37,71,.03)",borderRadius:12,
                      border:`1px solid ${C.faint}`}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:C.gold}}>#{b.id} {b.speed} km/h</span>
                        <button onClick={(e)=>{e.stopPropagation();deleteBall(b.id);}}
                          style={{flexShrink:0,background:"transparent",border:"1px solid rgba(239,68,68,.3)",
                            borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:10,color:C.red,fontWeight:700}}>
                          ✕ Delete
                        </button>
                      </div>
                      {/* Camera thumbnails */}
                      <div style={{display:"flex",gap:4,marginBottom:6}}>
                        {(CAMERA_ANGLES[SESSION.cameraMode]||CAMERA_ANGLES[1]).map(cam=>(
                          <div key={cam.id} style={{flex:1,borderRadius:6,height:46,flexShrink:0,
                            background:`radial-gradient(ellipse at 50% 40%,#E8F0F8,#111)`,
                            display:"flex",alignItems:"center",justifyContent:"center",gap:3,
                            fontSize:9,fontWeight:600,color:"rgba(255,255,255,.7)",position:"relative"}}>
                            <span style={{fontSize:14}}>{cam.icon}</span>
                            <span style={{fontSize:7}}>{cam.label.split(" ")[0]}</span>
                          </div>
                        ))}
                      </div>
                      {b.note&&<div style={{fontSize:10,color:C.muted,marginBottom:2,lineHeight:1.3}}>📝 {b.note}</div>}
                      {b.audioUrl&&<div style={{fontSize:10,color:C.muted}}>🎙️ Voice note attached</div>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}

        <div style={{height:20}}/>

        <button onClick={()=>onNav("recordSession",{cameraMode:SESSION.cameraMode})}
          style={{...S.btn("ghost"),marginBottom:10}}>📹 Take More Videos</button>
        <button onClick={()=>onNav("sessionEnded")} style={S.btn()}>Confirm & Upload Session →</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — SESSION ENDED
// ═══════════════════════════════════════════════════════════════════════════════
function SessionEnded({onNav}){
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Session Submitted"/>
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 24px"}}>
        <Card style={{textAlign:"center",padding:"28px 16px",marginBottom:16}}>
          <div style={{fontSize:44,marginBottom:10}}>✅</div>
          <div style={S.h2}>Session Complete!</div>
          <div style={{...S.sub,marginTop:4}}>Pre-Match Nets · 27 May 2026</div>
          <div style={{...S.sub}}>MA Chidambaram Nets A</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:16}}>
            {[{l:"Students",v:4},{l:"Balls",v:24},{l:"Duration",v:"1h 12m"}].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:C.gold}}>{s.v}</div>
                <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card onClick={()=>onNav("sessionAnalysis")} style={{marginBottom:16,cursor:"pointer"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.amber,animation:"blink 1s infinite"}}/>
            <div style={{flex:1}}>
              <div style={S.h3}>AI Analysis in progress</div>
              <div style={S.sub}>Tap to view results · Reports available</div>
            </div>
            <span style={{fontSize:14,color:C.gold}}>›</span>
          </div>
        </Card>
        <div style={{...S.sectionTitle}}>STUDENT SUMMARY</div>
        {STUDENTS.filter(s=>SESSION.selectedStudentIds.includes(s.id)).map(s=>{
          const bws=SESSION.ballsLogged.filter(b=>b.student===s.initials);
          return(
            <Card key={s.id} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar initials={s.initials} size={36}/>
                <div style={{flex:1}}>
                  <div style={S.h3}>{s.name}</div>
                  <div style={S.sub}>{bws.length} ball{bws.length!==1?"s":""} recorded</div>
                </div>
                <Badge status="processing"/>
              </div>
            </Card>
          );
        })}
        <div style={{height:14}}/>
        <button onClick={()=>onNav("coachHome")} style={S.btn()}>Back to Home</button>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION ANALYSIS — analyzed videos per bowler
// ═══════════════════════════════════════════════════════════════════════════════
function SessionAnalysisPage({onNav}){
  const [openBowler,setOpenBowler]=useState(null);
  const selectedStudents=STUDENTS.filter(s=>SESSION.selectedStudentIds.includes(s.id));
  const balls=[...SESSION.ballsLogged];

  const bowlerBalls=(student)=>balls.filter(b=>b.student===student.initials);

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="AI Analysis Results"/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 16px"}}>
        <Card style={{textAlign:"center",padding:"20px 16px",marginBottom:16,
          background:"rgba(34,197,94,.06)",border:"1px solid rgba(34,197,94,.25)"}}>
          <div style={{fontSize:36,marginBottom:8}}>✨</div>
          <div style={S.h2}>Analysis Complete</div>
          <div style={{...S.sub,marginTop:4}}>{SESSION.sessionName} · {SESSION.venue}</div>
          <div style={{fontSize:11,color:C.gold,fontWeight:700,marginTop:6}}>{balls.length} deliveries analysed</div>
        </Card>

        <div style={{...S.sectionTitle}}>BOWLER BREAKDOWN</div>
        {selectedStudents.map(st=>{
          const bws=bowlerBalls(st);
          const isOpen=openBowler===st.id;
          return(
            <Card key={st.id} style={{marginBottom:10,overflow:"hidden"}}>
              <div onClick={()=>setOpenBowler(isOpen?null:st.id)}
                style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <Avatar initials={st.initials} size={40}/>
                <div style={{flex:1}}>
                  <div style={S.h3}>{st.name}</div>
                  <div style={S.sub}>{bws.length} ball{bws.length!==1?"s":""} · Avg {(st.avgSpeed).toFixed(0)} km/h</div>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:C.gold,fontFamily:"monospace",marginRight:4}}>
                  {bws.length}
                </div>
                <span style={{fontSize:14,color:C.muted,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s"}}>›</span>
              </div>

              {isOpen&&(
                <div style={{marginTop:10,borderTop:`1px solid ${C.faint}`,paddingTop:10}}>
                  {bws.length===0&&(
                    <div style={{...S.sub,textAlign:"center",padding:"12px 0",fontSize:11}}>No deliveries recorded</div>
                  )}
                  {bws.map(b=>{
                    const topSpeed=Math.max(...balls.map(x=>x.speed));
                    return(
                      <div key={b.id} style={{marginBottom:8,padding:"10px 12px",
                        background:"rgba(10,37,71,.03)",borderRadius:12,
                        border:`1px solid ${C.faint}`}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          <span style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:C.gold}}>{b.speed} km/h</span>
                          {b.speed===topSpeed&&<Badge status="completed"/>}
                          <div style={{marginLeft:"auto",fontSize:9,color:C.muted}}>#{b.id}</div>
                        </div>
                        {/* 3 analysed camera thumbnails */}
                        <div style={{display:"flex",gap:4,marginBottom:6}}>
                          {(CAMERA_ANGLES[SESSION.cameraMode]||CAMERA_ANGLES[1]).map(cam=>(
                            <div key={cam.id} style={{flex:1,borderRadius:6,height:52,flexShrink:0,position:"relative",
                              background:`radial-gradient(ellipse at 50% 40%,#E8F0F8,#000)`,
                              display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>
                              <span>{cam.icon}</span>
                              <div style={{position:"absolute",bottom:2,right:2,background:"rgba(0,0,0,.7)",
                                borderRadius:4,padding:"1px 5px",fontSize:7,color:"#fff",fontFamily:"monospace"}}>✦ AI</div>
                              <div style={{position:"absolute",top:2,left:3,fontSize:7,color:"rgba(255,255,255,.6)",fontWeight:600}}>{cam.label.split(" ")[0]}</div>
                              {b.speed===topSpeed&&cam.id==="umpire"&&(
                                <div style={{position:"absolute",top:2,right:2,fontSize:7,background:C.gold,
                                  borderRadius:3,padding:"1px 3px",color:C.midnight,fontWeight:700}}>⭐</div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
                          <span style={{fontSize:9,color:C.muted}}>Off stump</span>
                          <span style={{fontSize:9,color:C.muted}}>·</span>
                          <span style={{fontSize:9,color:C.muted}}>Good length</span>
                          <span style={{fontSize:9,color:C.muted}}>·</span>
                          <span style={{fontSize:9,color:C.muted}}>Outswing</span>
                        </div>
                        {b.note&&<div style={{fontSize:10,color:C.muted,marginBottom:4,lineHeight:1.3,borderLeft:`2px solid ${C.goldD}`,paddingLeft:6}}>
                          📝 {b.note}
                        </div>}
                        {/* AI feedback line */}
                        <div style={{marginTop:4,fontSize:9,color:C.brand,
                          background:"rgba(31,115,214,.06)",borderRadius:6,padding:"5px 8px",lineHeight:1.4}}>
                          ✨ Seam position: 9.2/10 · Release angle: optimal · Suggested: maintain wrist height
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}

        <div style={{height:14}}/>
        <button onClick={()=>onNav("sessionEnded")} style={S.btn()}>← Back to Session Summary</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — ALL SESSIONS
// ═══════════════════════════════════════════════════════════════════════════════
function AllSessions({onBack,onNav}){
  const [filter,setFilter]=useState("all");
  const filtered=SESSIONS_DATA.filter(s=>filter==="all"||s.status===filter);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      <TopBar title="Sessions" onBack={onBack}/>
      <div style={{padding:"10px 16px 6px",flexShrink:0}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {["all","ongoing","completed"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={S.pill(filter===f)}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:10,padding:"8px 16px",flexShrink:0}}>
        {[{l:"Total",v:SESSIONS_DATA.length},{l:"Live",v:1},{l:"Done",v:4}].map(s=>(
          <Card key={s.l} style={{flex:1,textAlign:"center",padding:"8px 4px"}}>
            <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:s.l==="Live"?C.red:C.gold}}>{s.v}</div>
            <div style={{fontSize:9,color:C.muted}}>{s.l.toUpperCase()}</div>
          </Card>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"4px 16px 16px"}}>
        {filtered.map(s=>(
          <Card key={s.id} style={{marginBottom:10,borderLeft:`3px solid ${s.status==="ongoing"?C.red:C.goldD}`}}
            onClick={()=>onNav("sessionDetail",s)}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={S.h3}>{s.name}</span><Badge status={s.status}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              <span style={S.sub}>{s.date}</span>
              <span style={S.sub}>· {s.venue}</span>
            </div>
            <div style={{display:"flex",gap:16,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.faint}`}}>
              {[{l:"Students",v:s.students},{l:"Balls",v:s.deliveries},{l:"Duration",v:s.duration}].map(m=>(
                <div key={m.l}>
                  <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:C.gold}}>{m.v}</div>
                  <div style={{fontSize:9,color:C.muted}}>{m.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <BottomNav active="sessions" onNav={(id)=>onNav(id)}
        tabs={[{id:"coachHome",icon:"🏠",label:"Home"},{id:"sessions",icon:"📋",label:"Sessions"},
          {id:"students",icon:"👥",label:"Students"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — SESSION DETAIL (with student drill-down)
// ═══════════════════════════════════════════════════════════════════════════════
function SessionDetail({session,onBack,onNav}){
  const s=session||SESSIONS_DATA[0];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title={s.name} onBack={onBack} right={<Badge status={s.status}/>}/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 24px"}}>
        <Card style={{marginBottom:14}}>
          <StatRow label="Date" value={s.date}/>
          <StatRow label="Venue" value={s.venue}/>
          <StatRow label="Duration" value={s.duration}/>
          <StatRow label="Total balls" value={s.deliveries} accent/>
          <StatRow label="Students" value={s.students} accent/>
        </Card>
        <Section title="STUDENTS IN THIS SESSION">
          {STUDENTS.slice(0,s.students).map(st=>(
            <Card key={st.id} style={{marginBottom:10}} onClick={()=>onNav("studentReport",st)}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <Avatar initials={st.initials} size={40}/>
                <div style={{flex:1}}>
                  <div style={S.h3}>{st.name}</div>
                  <div style={S.sub}>{st.role}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"monospace",fontSize:14,fontWeight:700,color:C.gold}}>{st.avgSpeed} km/h</div>
                  <div style={{fontSize:9,color:C.muted,marginTop:2}}>AVG SPEED</div>
                </div>
                <span style={{fontSize:16,color:C.muted}}>›</span>
              </div>
            </Card>
          ))}
        </Section>
        {s.status==="ongoing"&&(
          <button onClick={()=>onNav("recordSession")} style={S.btn()}>Resume Recording →</button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH — ALL STUDENTS
// ═══════════════════════════════════════════════════════════════════════════════
function AllStudents({onBack,onNav}){
  const [search,setSearch]=useState("");
  const filtered=STUDENTS.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      <TopBar title="Students" onBack={onBack}/>
      <div style={{padding:"10px 16px",flexShrink:0}}>
        <div style={{position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search students..."
            style={{...S.input,paddingLeft:36}}/>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>🔍</span>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 16px"}}>
        {filtered.map(s=>(
          <Card key={s.id} style={{marginBottom:10}} onClick={()=>onNav("studentReport",s)}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Avatar initials={s.initials} size={44}/>
              <div style={{flex:1}}>
                <div style={S.h3}>{s.name}</div>
                <div style={S.sub}>{s.role} · {s.sessions} sessions</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"monospace",fontSize:15,fontWeight:700,color:C.gold}}>{s.avgSpeed}</div>
                <div style={{fontSize:9,color:C.muted}}>km/h avg</div>
              </div>
              <span style={{fontSize:16,color:C.muted}}>›</span>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav active="students" onNav={(id)=>onNav(id)}
        tabs={[{id:"coachHome",icon:"🏠",label:"Home"},{id:"sessions",icon:"📋",label:"Sessions"},
          {id:"students",icon:"👥",label:"Students"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — STUDENT REPORT (Coach & Student both land here)
// ═══════════════════════════════════════════════════════════════════════════════
function StudentReport({student,onBack,onNav,isStudent=false}){
  const st=student||STUDENTS[0];
  const [activeSession,setActiveSession]=useState(null);
  if(activeSession) return <SessionBallsView student={st} session={activeSession} onBack={()=>setActiveSession(null)}/>;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",
      paddingBottom:isStudent?74:20}}>
      <TopBar title={isStudent?"My Performance":st.name} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 20px"}}>
        {/* Profile card */}
        <Card style={{marginBottom:14,textAlign:"center",padding:"20px 16px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
            <Avatar initials={st.initials} size={62} active/>
          </div>
          <div style={S.h2}>{st.name}</div>
          <div style={{...S.sub,marginTop:2}}>{st.role} · Chennai Super Kings</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:14}}>
            {[{l:"Sessions",v:st.sessions},{l:"Avg Speed",v:`${st.avgSpeed}`},{l:"Top Speed",v:`${st.topSpeed}`}].map(m=>(
              <div key={m.l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"Impact,sans-serif",fontSize:24,color:C.gold,fontWeight:900}}>{m.v}</div>
                <div style={{fontSize:9,color:C.muted}}>{m.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Speed trend */}
        <Card style={{marginBottom:14,padding:"12px 8px"}}>
          <div style={{...S.h3,marginBottom:8,paddingLeft:4}}>Speed Trend (km/h)</div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={speedTrend} margin={{top:4,right:8,bottom:4,left:-22}}>
              <XAxis dataKey="s" tick={{fill:"rgba(10,37,71,.3)",fontSize:9}} tickLine={false} axisLine={false}/>
              <YAxis domain={[128,145]} tick={{fill:"rgba(10,37,71,.3)",fontSize:9}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.goldD}`,borderRadius:8,fontSize:11}}
                labelStyle={{color:C.muted}} itemStyle={{color:C.gold,fontFamily:"monospace"}}
                formatter={v=>[`${v} km/h`,"Speed"]}/>
              <Line type="monotone" dataKey="v" stroke={C.gold} strokeWidth={2.5}
                dot={{fill:C.gold,r:3,strokeWidth:0}} activeDot={{r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar */}
        <Card style={{marginBottom:14,padding:"12px 8px"}}>
          <div style={{...S.h3,marginBottom:4,paddingLeft:4}}>Skill Radar</div>
          <ResponsiveContainer width="100%" height={160}>
            <RadarChart data={radarData} margin={{top:4,right:16,bottom:4,left:16}}>
              <PolarGrid stroke="rgba(10,37,71,.1)"/>
              <PolarAngleAxis dataKey="sub" tick={{fill:"rgba(10,37,71,.5)",fontSize:9}}/>
              <Radar dataKey="A" stroke={C.gold} fill={C.gold} fillOpacity={0.18} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Summary */}
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:16}}>✨</span>
            <span style={{...S.h3,color:C.gold}}>AI Coaching Summary</span>
          </div>
          {[
            {icon:"💪",label:"Strength",text:"High release point with excellent seam consistency across sessions."},
            {icon:"⚠️",label:"Work on",text:"Arm height varies slightly on back-of-length deliveries — focus on shoulder alignment."},
            {icon:"🎯",label:"Tip",text:"Your yorker success rate improved 18% this month. Keep the wrist position high."},
          ].map(f=>(
            <div key={f.label} style={{display:"flex",gap:10,marginBottom:10,
              background:"rgba(10,37,71,.03)",borderRadius:10,padding:"9px 10px"}}>
              <span style={{fontSize:18,flexShrink:0}}>{f.icon}</span>
              <div>
                <div style={{fontSize:10,color:C.gold,fontWeight:700,marginBottom:2}}>{f.label.toUpperCase()}</div>
                <div style={{fontSize:11,color:"rgba(10,37,71,.75)",lineHeight:1.5}}>{f.text}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Session breakdown */}
        <Section title="SESSION BREAKDOWN — TAP TO DRILL DOWN">
          {SESSIONS_DATA.slice(0,4).map(s=>(
            <Card key={s.id} style={{marginBottom:10}} onClick={()=>setActiveSession(s)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={S.h3}>{s.name}</span><Badge status={s.status}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
                <span style={S.sub}>{s.date}</span>
                <span style={S.sub}>· {s.venue}</span>
              </div>
              <div style={{display:"flex",gap:16,paddingTop:8,borderTop:`1px solid ${C.faint}`}}>
                {[{l:"Balls",v:s.deliveries},{l:"Avg",v:`${st.avgSpeed} km/h`},{l:"Top",v:`${st.topSpeed} km/h`}].map(m=>(
                  <div key={m.l}>
                    <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:C.gold}}>{m.v}</div>
                    <div style={{fontSize:9,color:C.muted}}>{m.l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Section>
      </div>

      {isStudent&&(
        <BottomNav active="dashboard" onNav={(id)=>onNav(id)}
          tabs={[{id:"studentHome",icon:"🏠",label:"Home"},{id:"dashboard",icon:"📊",label:"Stats"},
            {id:"sessions",icon:"📋",label:"Sessions"},{id:"profile",icon:"👤",label:"Profile"}]}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — SESSION BALLS VIEW (drill-down to ball level)
// ═══════════════════════════════════════════════════════════════════════════════
function SessionBallsView({student,session,onBack}){
  const [activeBall,setActiveBall]=useState(null);
  if(activeBall) return <BallDetail ball={activeBall} onBack={()=>setActiveBall(null)}/>;
  const speeds=BALLS.map(b=>b.speed);
  const avg=Math.round(speeds.reduce((a,b)=>a+b,0)/speeds.length);
  const top=Math.max(...speeds);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title={session.name} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 24px"}}>
        <Card style={{marginBottom:14}}>
          <div style={S.sub}>{session.date} · {session.venue}</div>
          <div style={{display:"flex",gap:16,marginTop:10}}>
            {[{l:"AVG",v:`${avg} km/h`,hi:false},{l:"TOP",v:`${top} km/h`,hi:true},{l:"BALLS",v:BALLS.length,hi:false}].map(m=>(
              <div key={m.l}>
                <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:m.hi?C.gold:C.white}}>{m.v}</div>
                <div style={{fontSize:9,color:C.muted}}>{m.l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Speed chart */}
        <Card style={{marginBottom:14,padding:"12px 8px"}}>
          <div style={{...S.h3,marginBottom:8,paddingLeft:4}}>Ball-by-ball Speed</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={BALLS.map((b,i)=>({n:i+1,s:b.speed}))} margin={{top:4,right:4,bottom:4,left:-24}}>
              <XAxis dataKey="n" tick={{fill:"rgba(10,37,71,.3)",fontSize:9}} tickLine={false} axisLine={false}/>
              <YAxis domain={[125,148]} tick={{fill:"rgba(10,37,71,.3)",fontSize:9}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.goldD}`,borderRadius:8,fontSize:11}}
                formatter={v=>[`${v} km/h`,"Speed"]} labelFormatter={l=>`Ball ${l}`}/>
              <Bar dataKey="s" fill={C.gold} radius={[3,3,0,0]} fillOpacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Section title={`ALL DELIVERIES — TAP FOR DETAIL`}>
          {BALLS.map(b=>(
            <Card key={b.id} style={{marginBottom:8,borderLeft:`3px solid ${b.speed===top?C.gold:C.goldD}`}}
              onClick={()=>setActiveBall(b)}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"rgba(245,197,24,.1)",
                    border:`1px solid ${C.goldD}`,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:10,fontWeight:700,color:C.gold}}>#{b.id}</div>
                  <div>
                    <span style={{fontFamily:"monospace",fontSize:15,fontWeight:700,color:b.speed===top?C.gold:C.white}}>{b.speed} km/h</span>
                    {b.speed===top&&<span style={{fontSize:9,color:C.gold,marginLeft:6,fontWeight:700}}>⭐ BEST</span>}
                    <div style={S.sub}>{b.line} · {b.length}</div>
                  </div>
                </div>
                <span style={{fontSize:16,color:C.muted}}>›</span>
              </div>
            </Card>
          ))}
        </Section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BALL DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function BallDetail({ball,onBack}){
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title={`Delivery #${ball.id}`} onBack={onBack}/>
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px 24px"}}>
        {/* Video placeholder */}
        <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,
          background:`radial-gradient(ellipse at 50% 40%,#E8F0F8,#000)`,
          height:190,display:"flex",alignItems:"center",justifyContent:"center",
          border:`1px solid ${C.goldD}`,position:"relative"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:6}}>▶️</div>
            <div style={{fontSize:10,color:C.muted}}>Tap to play · Auto-loop</div>
          </div>
          {ball.speed===141&&(
            <div style={{position:"absolute",top:10,right:12,
              background:"rgba(245,197,24,.15)",border:`1px solid ${C.goldD}`,
              borderRadius:20,padding:"4px 12px",fontSize:9,color:C.gold,fontWeight:700}}>
              ⭐ BEST BALL
            </div>
          )}
          <div style={{position:"absolute",bottom:10,left:12,background:"rgba(0,0,0,.65)",
            borderRadius:7,padding:"3px 8px",fontFamily:"monospace",fontSize:10,color:C.white}}>0:05</div>
        </div>

        {/* Metrics */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{l:"Speed",v:`${ball.speed} km/h`,hi:true},{l:"Line",v:ball.line},{l:"Length",v:ball.length},{l:"Swing",v:ball.swing}].map(m=>(
            <Card key={m.l} style={{flex:1,textAlign:"center",padding:"9px 4px"}}>
              <div style={{fontSize:11,fontWeight:700,color:m.hi?C.gold:C.white,lineHeight:1.3}}>{m.v}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>{m.l.toUpperCase()}</div>
            </Card>
          ))}
        </div>

        {/* AI Feedback */}
        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:16}}>✨</span>
            <span style={{...S.h3,color:C.gold}}>AI Feedback</span>
          </div>
          <div style={{fontSize:12,color:"rgba(10,37,71,.8)",lineHeight:1.7}}>{ball.feedback}</div>
        </Card>

        {/* Coach note */}
        <Card style={{background:"rgba(245,158,11,.06)",border:"1px solid rgba(245,158,11,.2)"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(245,158,11,.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.amber}}>SB</div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:C.amber}}>Coach Note</div>
              <div style={{fontSize:9,color:C.muted}}>S. Badrinath</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"rgba(10,37,71,.7)",lineHeight:1.6,fontStyle:"italic"}}>
            "Keep the arm high on these good-length deliveries — this is your template."
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT HOME
// ═══════════════════════════════════════════════════════════════════════════════
function StudentHome({onNav}){
  const me=STUDENTS[0];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      <div style={{background:`radial-gradient(ellipse at 20% 30%,#DCE9F7,${C.midnight})`,
        padding:"52px 20px 20px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-20,right:-20,fontSize:120,opacity:.04,lineHeight:1}}>🦁</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>👋 Welcome back</div>
        <div style={S.h1}>{me.name}</div>
        <div style={S.sub}>{me.role} · Chennai Super Kings</div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          {[{l:"Sessions",v:me.sessions},{l:"Avg Speed",v:`${me.avgSpeed}`},{l:"Top Speed",v:`${me.topSpeed}`}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(10,37,71,.06)",borderRadius:12,
              border:`1px solid ${C.goldD}`,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:C.gold}}>{s.v}</div>
              <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        {/* New report alert */}
        <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.25)",
          borderRadius:12,padding:"11px 14px",marginBottom:16,
          display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.green,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:C.white}}>New report ready</div>
            <div style={S.sub}>27 May · 8 balls · avg {me.avgSpeed} km/h</div>
          </div>
          <button onClick={()=>onNav("dashboard")} style={{background:C.green,border:"none",borderRadius:8,
            padding:"6px 12px",color:C.midnight,fontSize:10,fontWeight:900,cursor:"pointer"}}>View →</button>
        </div>

        <Section title="RECENT SESSIONS">
          {SESSIONS_DATA.slice(0,3).map(s=>(
            <Card key={s.id} style={{marginBottom:10}} onClick={()=>onNav("dashboard")}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={S.h3}>{s.name}</span><Badge status={s.status}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <span style={S.sub}>{s.date}</span>
                <span style={S.sub}>· {s.venue}</span>
                {s.status==="completed"&&<span style={{fontSize:11,color:C.gold,fontFamily:"monospace",fontWeight:700}}>· {me.avgSpeed} km/h</span>}
              </div>
            </Card>
          ))}
        </Section>

        <Section title="QUICK INSIGHTS">
          <div style={{display:"flex",gap:10}}>
            {[{icon:"📈",l:"Speed up",v:"+3 km/h",sub:"vs last month"},{icon:"🎯",l:"Accuracy",v:"76%",sub:"off-stump line"},{icon:"⚡",l:"Best ball",v:"141",sub:"km/h this week"}].map(m=>(
              <Card key={m.l} style={{flex:1,textAlign:"center",padding:"12px 6px"}}>
                <div style={{fontSize:20,marginBottom:6}}>{m.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:C.gold}}>{m.v}</div>
                <div style={{fontSize:9,color:C.white,marginTop:2}}>{m.l}</div>
                <div style={{fontSize:9,color:C.muted}}>{m.sub}</div>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      <BottomNav active="studentHome" onNav={(id)=>onNav(id)}
        tabs={[{id:"studentHome",icon:"🏠",label:"Home"},{id:"dashboard",icon:"📊",label:"Stats"},
          {id:"sessions",icon:"📋",label:"Sessions"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UPLOAD VIDEO
// ═══════════════════════════════════════════════════════════════════════════════
const ANALYZE_MESSAGES=[
  "Detecting ball in frame…","Tracking trajectory…","Computing release speed…",
  "Measuring line & length…","Analysing seam position…","Generating overlay…","Finalising output…",
];

function UploadVideo({onBack}){
  const [stage,setStage]=useState("idle");
  const [videoName,setVideoName]=useState("");
  const [videoUrl,setVideoUrl]=useState("");
  const [dragOver,setDragOver]=useState(false);
  const [playbackErr,setPlaybackErr]=useState("");
  const [selectedFile,setSelectedFile]=useState(null);
  const [previewUrl,setPreviewUrl]=useState("");
  const fileRef=useRef(null);
  const videoRef=useRef(null);

  useEffect(()=>{
    if(stage==="result"&&videoRef.current){
      videoRef.current.load();
      videoRef.current.play().catch(e=>setPlaybackErr(String(e)));
    }
  },[stage,videoUrl]);

  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);},[previewUrl]);

  const lookupVideo=(f)=>{
    if(!f)return;
    const name=f.name.replace(/\.[^.]+$/,"")+".mp4";
    const url=`https://jncoaqpqtrkrmrpxxmmh.supabase.co/storage/v1/object/public/output_vids/${encodeURIComponent(name)}`;
    setVideoName(name);
    setVideoUrl(url);
    setPlaybackErr("");
    setStage("loading");
    fetch(url,{method:"GET"}).then(r=>{
      if(r.ok){setStage("result");}else{setStage("notFound");}
    }).catch(()=>setStage("notFound"));
  };

  const handleConfirm=()=>{
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    lookupVideo(selectedFile);
  };

  const handleInput=(e)=>{
    const f=e.target.files[0];
    if(!f)return;
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStage("preview");
    e.target.value="";
  };

  const handleDrop=(e)=>{
    e.preventDefault();
    setDragOver(false);
    const f=e.dataTransfer.files[0];
    if(!f)return;
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStage("preview");
  };

  const reset=()=>{
    setStage("idle");
    setVideoName("");
    setVideoUrl("");
    setSelectedFile(null);
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%"}}>
      <TopBar title="Upload Video" onBack={onBack}/>

      {stage==="idle"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px 18px 28px"}}>
          <div onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
            style={{border:`2px dashed ${dragOver?C.gold:C.goldD}`,borderRadius:18,
              background:dragOver?C.goldG:"rgba(10,37,71,.03)",
              padding:"32px 18px",textAlign:"center",cursor:"pointer",marginBottom:16,
              transition:"all .2s"}}>
            <div style={{fontSize:36,marginBottom:8}}>{dragOver?"🎥":"📁"}</div>
            <div style={{fontSize:13,fontWeight:700,color:C.white}}>
              {dragOver?"Drop to find output":"Upload your input bowling video"}
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:4}}>drop a file named VID_x_y to see its analysed output</div>
          </div>
          <input ref={fileRef} type="file" accept="video/*" style={{display:"none"}} onChange={handleInput}/>
        </div>
      )}

      {stage==="preview"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px 18px 28px"}}>
          <Card style={{marginBottom:10,padding:"10px 14px",background:"rgba(59,130,246,.06)",
            border:"1px solid rgba(59,130,246,.25)"}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:16}}>📄</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.white}}>Selected video</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{selectedFile?.name}</div>
              </div>
            </div>
          </Card>

          <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,
            background:"#000",border:`1px solid ${C.goldD}`}}>
            <video src={previewUrl} controls muted playsInline
              style={{width:"100%",maxHeight:300,objectFit:"contain",display:"block",background:"#000"}}/>
          </div>

          <button onClick={handleConfirm} style={{...S.btn(),marginBottom:10}}>Confirm & Upload →</button>
          <button onClick={reset} style={S.btn("ghost")}>← Go Back</button>
        </div>
      )}

      {stage==="loading"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:"28px 22px"}}>
          <div style={{position:"relative",width:72,height:72,marginBottom:18}}>
            <div style={{position:"absolute",inset:0,borderRadius:"50%",
              border:`3px solid ${C.goldD}`,animation:"spin 1.4s linear infinite"}}/>
            <div style={{position:"absolute",inset:5,borderRadius:"50%",
              border:`3px solid transparent`,borderTopColor:C.gold,
              animation:"spin .8s linear infinite"}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:26}}>🏏</div>
          </div>
          <div style={{...S.h2,marginBottom:4,textAlign:"center"}}>Loading output video…</div>
          <div style={{fontSize:11,color:C.muted,textAlign:"center"}}>{videoName}</div>
        </div>
      )}

      {stage==="notFound"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:"28px 22px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🔍</div>
          <div style={{...S.h2,marginBottom:4,textAlign:"center"}}>No output found</div>
          <div style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:20}}>
            No analysed video matches <span style={{fontFamily:"monospace",color:C.white}}>{videoName}</span>
          </div>
          <button onClick={reset} style={S.btn("ghost")}>↩ Try Another Video</button>
        </div>
      )}

      {stage==="result"&&(
        <div style={{flex:1,overflowY:"auto",padding:"10px 16px 28px"}}>
          <Card style={{marginBottom:10,padding:"10px 14px",background:"rgba(34,197,94,.06)",
            border:"1px solid rgba(34,197,94,.25)"}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:16}}>🎬</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.white}}>Analysed output</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{videoName}</div>
              </div>
            </div>
          </Card>

          <div style={{borderRadius:16,overflow:"hidden",marginBottom:14,
            background:"#000",border:`1px solid ${C.goldD}`,position:"relative"}}>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              muted
              loop
              playsInline
              crossOrigin="anonymous"
              type="video/mp4"
              onError={()=>setPlaybackErr("video element error")}
              style={{width:"100%",maxHeight:300,objectFit:"contain",display:"block",background:"#000"}}
            />
            {playbackErr&&(
              <div style={{position:"absolute",bottom:8,left:8,right:8,
                background:"rgba(220,38,38,.85)",borderRadius:8,padding:"6px 10px",
                fontSize:10,color:"#fff",textAlign:"center"}}>
                Playback failed: {playbackErr}
              </div>
            )}
            <div style={{position:"absolute",top:8,right:10,
              background:"rgba(0,0,0,.72)",borderRadius:20,padding:"4px 12px",
              fontSize:9,color:C.gold,fontWeight:700,letterSpacing:.5,
              border:"1px solid rgba(255,199,44,.3)"}}>▶ ANALYSED ✦</div>
          </div>

          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[{l:"Speed",v:"138 km/h",hi:true},{l:"Line",v:"Off stump"},{l:"Length",v:"Good"},{l:"Swing",v:"Out"}].map(m=>(
              <Card key={m.l} style={{flex:1,textAlign:"center",padding:"9px 4px"}}>
                <div style={{fontSize:10,fontWeight:700,color:m.hi?C.gold:C.white,lineHeight:1.3}}>{m.v}</div>
                <div style={{fontSize:8,color:C.muted,marginTop:3}}>{m.l.toUpperCase()}</div>
              </Card>
            ))}
          </div>

          <div style={{marginBottom:10,textAlign:"center"}}>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer"
              style={{fontSize:10,color:C.brand,textDecoration:"underline"}}>
              Open video directly ↗
            </a>
          </div>
          <button onClick={reset} style={S.btn("ghost")}>↩ Find Another Video</button>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COACH PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function CoachProfile({onNav,onLogout}){
  const MENU=[
    {icon:"📋",label:"My Sessions",sub:"View all recorded sessions",to:"sessions"},
    {icon:"👥",label:"My Students",sub:"Manage your student roster",to:"students"},
    {icon:"📤",label:"Upload Video",sub:"Analyse a single delivery",to:"uploadVideo"},
    {icon:"🔔",label:"Notifications",sub:"Insights & report alerts",to:null},
    {icon:"⚙️",label:"Settings",sub:"App preferences",to:null},
    {icon:"❓",label:"Help & Support",sub:"Guides and FAQs",to:null},
  ];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      {/* Header */}
      <div style={{background:`radial-gradient(ellipse at 20% 30%,#DCE9F7,${C.midnight})`,
        padding:"52px 20px 24px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-20,right:-20,fontSize:120,opacity:.04,lineHeight:1}}>🦁</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:62,height:62,borderRadius:"50%",
            background:`radial-gradient(circle,#E1EDF9,${C.midnight})`,
            border:`2.5px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:22,fontWeight:700,color:C.gold,flexShrink:0,
            boxShadow:`0 0 16px rgba(245,197,24,.35)`}}>CD</div>
          <div>
            <div style={S.h1}>Coach Dhruv</div>
            <div style={{...S.sub,marginTop:2}}>Head Coach · CSK Academy</div>
            <div style={{fontSize:10,color:C.gold,marginTop:4,fontWeight:600}}>coach@csk.in</div>
          </div>
        </div>
        {/* Quick stats */}
        <div style={{display:"flex",gap:10,marginTop:16}}>
          {[{l:"Students",v:STUDENTS.length},{l:"Sessions",v:SESSIONS_DATA.length},{l:"Deliveries",v:248}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(10,37,71,.08)",borderRadius:12,
              border:`1px solid ${C.goldD}`,padding:"9px 6px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:C.gold}}>{s.v}</div>
              <div style={{fontSize:8,color:C.muted,marginTop:2,fontWeight:600,letterSpacing:.5}}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        {/* Menu items */}
        <div style={{...S.sectionTitle,marginBottom:8}}>QUICK ACCESS</div>
        {MENU.map((item,i)=>(
          <div key={i} onClick={()=>item.to&&onNav(item.to)}
            style={{...S.card,marginBottom:10,cursor:item.to?"pointer":"default",
              display:"flex",alignItems:"center",gap:12,
              opacity:item.to?1:.55}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.goldG,
              border:`1px solid ${C.goldD}`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:18,flexShrink:0}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={S.h3}>{item.label}</div>
              <div style={{...S.sub,marginTop:2,fontSize:10}}>{item.sub}</div>
            </div>
            <span style={{fontSize:16,color:C.muted}}>›</span>
          </div>
        ))}

        {/* Logout */}
        <div style={{marginTop:8}}>
          <button onClick={onLogout}
            style={{width:"100%",padding:"14px 0",borderRadius:14,cursor:"pointer",fontSize:13,
              fontWeight:800,letterSpacing:.5,background:"transparent",
              border:"1.5px solid rgba(239,68,68,.4)",color:"#EF4444",
              boxShadow:"0 4px 12px -6px rgba(239,68,68,.25)"}}>
            Sign Out
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:14,paddingBottom:4}}>
          <div style={{fontSize:9,color:"rgba(10,37,71,.25)",letterSpacing:1}}>CSK COACHING PLATFORM · v1.0</div>
        </div>
      </div>

      <BottomNav active="profile" onNav={(id)=>onNav(id)}
        tabs={[{id:"coachHome",icon:"🏠",label:"Home"},{id:"sessions",icon:"📋",label:"Sessions"},
          {id:"students",icon:"👥",label:"Students"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function StudentProfile({onNav,onLogout}){
  const me=STUDENTS[0];
  const MENU=[
    {icon:"📊",label:"My Stats",sub:"Speed trends and skill radar",to:"dashboard"},
    {icon:"📋",label:"My Sessions",sub:"All recorded sessions",to:"sessions"},
    {icon:"🔔",label:"Notifications",sub:"New reports and coach notes",to:null},
    {icon:"⚙️",label:"Settings",sub:"App preferences",to:null},
    {icon:"❓",label:"Help & Support",sub:"Guides and FAQs",to:null},
  ];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.navy,minHeight:"100%",paddingBottom:74}}>
      {/* Header */}
      <div style={{background:`radial-gradient(ellipse at 20% 30%,#DCE9F7,${C.midnight})`,
        padding:"52px 20px 24px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-20,right:-20,fontSize:120,opacity:.04,lineHeight:1}}>🦁</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Avatar initials={me.initials} size={62} active/>
          <div>
            <div style={S.h1}>{me.name}</div>
            <div style={{...S.sub,marginTop:2}}>{me.role} · Chennai Super Kings</div>
            <div style={{fontSize:10,color:C.gold,marginTop:4,fontWeight:600}}>{me.name.toLowerCase().replace(" ",".")}@csk.in</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          {[{l:"Sessions",v:me.sessions},{l:"Avg Speed",v:`${me.avgSpeed}`},{l:"Top Speed",v:`${me.topSpeed}`}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(10,37,71,.08)",borderRadius:12,
              border:`1px solid ${C.goldD}`,padding:"9px 6px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:C.gold}}>{s.v}</div>
              <div style={{fontSize:8,color:C.muted,marginTop:2,fontWeight:600,letterSpacing:.5}}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        <div style={{...S.sectionTitle,marginBottom:8}}>QUICK ACCESS</div>
        {MENU.map((item,i)=>(
          <div key={i} onClick={()=>item.to&&onNav(item.to)}
            style={{...S.card,marginBottom:10,cursor:item.to?"pointer":"default",
              display:"flex",alignItems:"center",gap:12,opacity:item.to?1:.55}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.goldG,
              border:`1px solid ${C.goldD}`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:18,flexShrink:0}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={S.h3}>{item.label}</div>
              <div style={{...S.sub,marginTop:2,fontSize:10}}>{item.sub}</div>
            </div>
            <span style={{fontSize:16,color:C.muted}}>›</span>
          </div>
        ))}

        <div style={{marginTop:8}}>
          <button onClick={onLogout}
            style={{width:"100%",padding:"14px 0",borderRadius:14,cursor:"pointer",fontSize:13,
              fontWeight:800,letterSpacing:.5,background:"transparent",
              border:"1.5px solid rgba(239,68,68,.4)",color:"#EF4444",
              boxShadow:"0 4px 12px -6px rgba(239,68,68,.25)"}}>
            Sign Out
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:14,paddingBottom:4}}>
          <div style={{fontSize:9,color:"rgba(10,37,71,.25)",letterSpacing:1}}>CSK COACHING PLATFORM · v1.0</div>
        </div>
      </div>

      <BottomNav active="profile" onNav={(id)=>onNav(id)}
        tabs={[{id:"studentHome",icon:"🏠",label:"Home"},{id:"dashboard",icon:"📊",label:"Stats"},
          {id:"sessions",icon:"📋",label:"Sessions"},{id:"profile",icon:"👤",label:"Profile"}]}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNEY_COACH=[
  {id:"splash",label:"Splash"},{id:"login",label:"Login"},
  {id:"coachHome",label:"Coach Home"},{id:"createSession",label:"Create Session"},
  {id:"recordSession",label:"Record Video"},{id:"sessionEnded",label:"Submit"},
  {id:"sessions",label:"All Sessions"},{id:"sessionDetail",label:"Session Detail"},
  {id:"students",label:"Students"},{id:"studentReport",label:"Student Report"},
  {id:"uploadVideo",label:"Upload Video"},
];
const JOURNEY_STUDENT=[
  {id:"splash",label:"Splash"},{id:"login",label:"Login"},
  {id:"studentHome",label:"Student Home"},{id:"dashboard",label:"Dashboard"},
  {id:"sessions",label:"Sessions"},
];

// Module-level session state — persists across screen transitions during a session lifecycle
const SESSION = {
  selectedStudentIds: [],
  ballsLogged: [],
  calibrationPts: [],
  sessionName: "",
  venue: "",
  date: "",
  cameraMode: 1,
};

const CAMERA_ANGLES = {
  1: [{id:"umpire",label:"Umpire View",icon:"📷"}],
  3: [
    {id:"umpire",label:"Umpire View",icon:"📷"},
    {id:"leg",label:"Leg Side",icon:"📸"},
    {id:"wk",label:"Wicket Keeper",icon:"🎬"},
  ],
};

export default function App(){
  const [screen,setScreen]=useState("splash");
  const [role,setRole]=useState(null);
  const [history,setHistory]=useState([]);
  const [ctx,setCtx]=useState({}); // extra context (session, student)
  const [sideTab,setSideTab]=useState("home");

  const nav=(s,data={})=>{
    setHistory(h=>[...h,{screen,ctx}]);
    setCtx(data);
    setScreen(s);
  };
  const back=()=>{
    if(!history.length)return;
    const prev=history[history.length-1];
    setScreen(prev.screen);setCtx(prev.ctx);
    setHistory(h=>h.slice(0,-1));
  };
  const login=(r)=>{setRole(r);nav(r==="coach"?"coachHome":"studentHome");};
  const switchRole=(r)=>{setRole(r);setHistory([]);setCtx({});setScreen(r==="coach"?"coachHome":"studentHome");};

  const renderScreen=()=>{
    switch(screen){
      case "splash": return <Splash onDone={()=>setScreen("login")}/>;
      case "login": return <Login onLogin={login}/>;
      case "coachHome": return <CoachHome onNav={(s,d)=>nav(s,d||{})}/>;
      case "createSession": return <CreateSession onBack={back} onNav={(s)=>nav(s)}/>;
      case "sessionCalibration": return <SessionCalibration onBack={back} onNav={(s)=>nav(s)}/>;
      case "recordSession": return <RecordSession onBack={back} onNav={(s)=>nav(s)}/>;
      case "coachingNote": return <CoachingNote onBack={back} onNav={(s)=>nav(s)} studentId={SESSION._pendingStuId}/>;
      case "sessionReview": return <SessionReview onNav={(s)=>nav(s)}/>;
      case "sessionEnded": return <SessionEnded onNav={(s)=>nav(s)}/>;
      case "sessionAnalysis": return <SessionAnalysisPage onNav={(s)=>nav(s)}/>;
      case "uploadVideo": return <UploadVideo onBack={back} onNav={(s)=>nav(s)}/>;
      case "sessions": return role==="coach"
        ? <AllSessions onBack={back} onNav={(s,d)=>nav(s,d||{})}/>
        : <StudentReport student={STUDENTS[0]} onBack={back} onNav={(s)=>nav(s)} isStudent/>;
      case "sessionDetail": return <SessionDetail session={ctx.id?ctx:null} onBack={back} onNav={(s,d)=>nav(s,d||{})}/>;
      case "students": return <AllStudents onBack={back} onNav={(s,d)=>nav(s,d||{})}/>;
      case "studentReport": return <StudentReport student={ctx.initials?ctx:STUDENTS[0]} onBack={back} onNav={(s)=>nav(s)} isStudent={role==="student"}/>;
      case "studentHome": return <StudentHome onNav={(s)=>nav(s)}/>;
      case "dashboard": return <StudentReport student={STUDENTS[0]} onBack={back} onNav={(s)=>nav(s)} isStudent/>;
      case "profile": return role==="coach"
        ? <CoachProfile onNav={(s)=>nav(s)} onLogout={()=>{setRole(null);setHistory([]);setCtx({});setScreen("login");}}/>
        : <StudentProfile onNav={(s)=>nav(s)} onLogout={()=>{setRole(null);setHistory([]);setCtx({});setScreen("login");}}/>;
      default: return <Splash onDone={()=>setScreen("login")}/>;
    }
  };

  return(
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"20px 12px",minHeight:"100vh",
      background:"radial-gradient(ellipse at 20% 0%,#FFFFFF,#DCE9F7 60%,#C9DCF1)",
      fontFamily:"system-ui,-apple-system,Segoe UI,sans-serif"}}>

      {/* Phone */}
      <div style={{width:390,flexShrink:0,borderRadius:44,overflow:"hidden",
        border:"2px solid rgba(10,37,71,.12)",
        boxShadow:`0 50px 100px -20px rgba(15,76,156,.45),0 0 0 1px rgba(10,37,71,.05)`,
        background:C.navy,height:844,display:"flex",flexDirection:"column"}}>
        {/* Status bar */}
        <div style={{height:50,background:C.navy,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"0 22px",flexShrink:0}}>
          <span style={{fontSize:12,fontWeight:700,color:C.white}}>9:41</span>
          <div style={{width:110,height:20,borderRadius:10,background:"#0A2547",border:"1px solid rgba(10,37,71,.2)"}}/>
          <div style={{display:"flex",gap:5,alignItems:"center",fontSize:12,color:C.white}}>
            <span>WiFi</span><span>🔋</span>
          </div>
        </div>
        {/* Screen */}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}>
          {renderScreen()}
        </div>
        {/* Home bar */}
        <div style={{height:22,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <div style={{width:118,height:4,borderRadius:2,background:"rgba(10,37,71,.17)"}}/>
        </div>
      </div>
    </div>
  );
}
