/* =====================================================================
   HAUSTEK — TRƯỜNG SÓNG ÂM 3D (WebGL thuần, không thư viện)
   Một mặt sàn hàng chục nghìn điểm nhìn từ góc thấp, phập phồng như
   sub-bass lăn qua phòng tối. Ở tâm là chấm REC đỏ, sóng loang ra đều
   đặn (MOTIF-01 của playbook, nhưng có chiều sâu). Rê chuột / chạm để
   tạo sóng; trang chủ nối thêm beat 124 BPM — mỗi tiếng kick bắn một
   vòng sóng đỏ qua mặt sàn.

   VÌ SAO KHÔNG DÙNG three.js
   Bản trước tải three.js (~600KB) từ cdnjs chỉ để vẽ điểm. Toàn bộ chuyển
   động ở đây tính trong vertex shader — JS mỗi khung chỉ gửi thời gian,
   ma trận camera và danh sách sóng. File này vài KB, không gọi máy chủ
   bên thứ ba nào (chính sách quyền riêng tư chỉ kể tên Google Fonts).

   KHI KHÔNG VẼ ĐƯỢC
   Máy không có WebGL, mất context, hoặc bật giảm chuyển động: trả về null
   (hoặc vẽ một khung tĩnh) và trang giữ nguyên hoạ tiết SVG đứng yên.
   ===================================================================== */
(function(){
  const MAXW=12;               /* số sóng chạy cùng lúc */
  const LIFE=5.0;              /* giây — sóng tắt hẳn sau chừng này */

  const VS=`
attribute vec2 aP;
uniform mat4 uPV;
uniform float uT,uFocal,uSize;
uniform vec2 uC;
uniform vec4 uW[${MAXW}];
varying float vA,vR;
void main(){
  vec2 p=aP;
  float d=length(p-uC);
  float h=sin(d*.55-uT*1.9)*.55*exp(-d*.035);                 /* sóng loang đều từ tâm */
  h+=sin(p.x*.09+uT*.35)*.7+cos(p.y*.11-uT*.28)*.6;            /* mặt sàn thở chậm */
  float hot=0.;
  for(int i=0;i<${MAXW};i++){
    vec4 w=uW[i];
    float age=uT-w.z;
    if(age>0.&&age<${LIFE.toFixed(1)}){
      float dd=length(p-w.xy)-age*11.;
      float k=exp(-dd*dd*.3)*exp(-age*.7);
      h+=abs(w.w)*k*2.4;
      if(w.w>0.)hot=max(hot,k*min(w.w*1.6,1.));
    }
  }
  vec4 cp=uPV*vec4(p.x,h,p.y,1.);
  gl_Position=cp;
  float core=exp(-d*d*.12);                                     /* chấm REC */
  vR=max(hot,core);
  float fog=clamp(1.-(cp.w-14.)/105.,0.,1.);                  /* xa thì chìm vào bóng tối */
  vA=fog*(.34+.3*clamp(h*.35+.5,0.,1.)+hot*.8+core);
  gl_PointSize=max(1.,uSize*uFocal/cp.w*(1.+hot*1.3+core*2.));
}`;
  const FS=`
precision mediump float;
varying float vA,vR;
void main(){
  vec2 c=gl_PointCoord-.5;
  float r=dot(c,c);
  if(r>.25)discard;
  float a=vA*smoothstep(.25,.02,r);
  vec3 col=mix(vec3(.94,.94,.95),vec3(1.,.18,.3),vR);
  gl_FragColor=vec4(col*a,a);
}`;

  /* ---------- toán ma trận tối thiểu (cột chính, như WebGL) ---------- */
  function persp(fy,asp,n,f){const t=1/Math.tan(fy/2),nf=1/(n-f);return [t/asp,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0];}
  function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
  function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
  function norm(a){const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];}
  function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
  function lookAt(e,c){
    const z=norm(sub(e,c)),x=norm(cross([0,1,0],z)),y=cross(z,x);
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,e),-dot(y,e),-dot(z,e),1];
  }
  function mul(a,b){const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[i+k*4]*b[k+j*4];o[i+j*4]=s;}return o;}
  function inv(m){
    const [a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23,a30,a31,a32,a33]=m;
    const b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,
          b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,
          b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32;
    let det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;
    if(!det)return null;det=1/det;
    return [(a11*b11-a12*b10+a13*b09)*det,(a02*b10-a01*b11-a03*b09)*det,(a31*b05-a32*b04+a33*b03)*det,(a22*b04-a21*b05-a23*b03)*det,
            (a12*b08-a10*b11-a13*b07)*det,(a00*b11-a02*b08+a03*b07)*det,(a32*b02-a30*b05-a33*b01)*det,(a20*b05-a22*b02+a23*b01)*det,
            (a10*b10-a11*b08+a13*b06)*det,(a01*b08-a00*b10-a03*b06)*det,(a30*b04-a31*b02+a33*b00)*det,(a21*b02-a20*b04-a23*b00)*det,
            (a11*b07-a10*b09-a12*b06)*det,(a00*b09-a01*b07+a02*b06)*det,(a31*b01-a30*b03-a32*b00)*det,(a20*b03-a21*b01+a22*b00)*det];
  }
  function apply(m,v){const o=[0,0,0,0];for(let i=0;i<4;i++)o[i]=m[i]*v[0]+m[i+4]*v[1]+m[i+8]*v[2]+m[i+12]*v[3];return o;}

  function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;}

  /* mount(canvas, opts) → {spawn(x,z,amp,red), kick(), center} hoặc null
     opts.center  [x,z] tâm sóng trên mặt sàn
     opts.eye     [x,y,z] vị trí camera;  opts.target  điểm camera nhìn vào
     opts.lite    true = ít điểm hơn (trang con, điện thoại)
     opts.pointer phần tử nhận thao tác chuột/chạm (mặc định: canvas) */
  function mount(canvas,opts){
    opts=opts||{};
    const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SMALL=matchMedia('(max-width:760px)').matches;
    const LITE=opts.lite||SMALL;
    let gl=null;
    try{gl=canvas.getContext('webgl',{antialias:false,alpha:true,premultipliedAlpha:true,powerPreference:'low-power'});}catch(e){}
    if(!gl)return null;
    const vs=shader(gl,gl.VERTEX_SHADER,VS),fs=shader(gl,gl.FRAGMENT_SHADER,FS);
    if(!vs||!fs)return null;
    const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
    gl.useProgram(pr);

    /* lưới điểm: rộng 120, sâu 90 đơn vị; điện thoại thưa hơn */
    const step=LITE?1.15:.72;
    const pts=[];
    for(let z=-72;z<=18;z+=step)for(let x=-60;x<=60;x+=step)pts.push(x,z);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts),gl.STATIC_DRAW);
    const aP=gl.getAttribLocation(pr,'aP');gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,2,gl.FLOAT,false,0,0);
    const N=pts.length/2;
    const U={};['uPV','uT','uFocal','uSize','uC','uW'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
    gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);   /* cộng sáng */

    const C=opts.center||[10,-8];
    const EYE=opts.eye||[0,12,26],TGT=opts.target||[0,-4,-18];
    gl.uniform2f(U.uC,C[0],C[1]);
    gl.uniform1f(U.uSize,SMALL?.2:.15);   /* cỡ chấm theo màn hình, không theo mật độ */

    const waves=new Float32Array(MAXW*4);for(let i=0;i<MAXW;i++)waves[i*4+2]=-99;
    let wi=0;
    const t0=performance.now();
    const now=()=>(performance.now()-t0)/1000;
    function spawn(x,z,amp,red){
      waves[wi*4]=x;waves[wi*4+1]=z;waves[wi*4+2]=now();waves[wi*4+3]=red?amp:-amp;
      wi=(wi+1)%MAXW;
    }

    let W=0,H=0,FOV=50*Math.PI/180,PV=null,mx=0,my=0,cx=0,cy=0,punch=0;
    function size(){
      const dpr=Math.min(devicePixelRatio||1,LITE?1.5:2);
      const r=canvas.getBoundingClientRect();
      W=Math.max(1,Math.round(r.width*dpr));H=Math.max(1,Math.round(r.height*dpr));
      if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
      gl.viewport(0,0,W,H);
    }
    function camera(){
      const eye=[EYE[0]+cx*2.4,EYE[1]+cy*1.2-punch*.5,EYE[2]-punch*1.2];
      const fov=FOV*(1-punch*.04);
      PV=mul(persp(fov,W/H,.1,200),lookAt(eye,TGT));
      gl.uniformMatrix4fv(U.uPV,false,new Float32Array(PV));
      gl.uniform1f(U.uFocal,H/2/Math.tan(fov/2));
    }
    function draw(t){
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uT,t);
      gl.uniform4fv(U.uW,waves);
      gl.drawArrays(gl.POINTS,0,N);
    }

    /* toạ độ màn hình → điểm trên mặt sàn y=0 (bỏ qua độ nhấp nhô) */
    function toFloor(clientX,clientY){
      if(!PV)return null;
      const r=canvas.getBoundingClientRect();
      const x=(clientX-r.left)/r.width*2-1,y=-((clientY-r.top)/r.height*2-1);
      const I=inv(PV);if(!I)return null;
      const a=apply(I,[x,y,-1,1]),b=apply(I,[x,y,1,1]);
      const p0=[a[0]/a[3],a[1]/a[3],a[2]/a[3]],p1=[b[0]/b[3],b[1]/b[3],b[2]/b[3]];
      const dy=p1[1]-p0[1];if(Math.abs(dy)<1e-6)return null;
      const t=-p0[1]/dy;if(t<0)return null;
      return [p0[0]+(p1[0]-p0[0])*t,p0[2]+(p1[2]-p0[2])*t];
    }

    size();camera();
    if(REDUCED){draw(2.2);return {spawn(){},kick(){},still:true};}

    let on=true,raf=0,last=0,lastIdle=0,lastMove=0;
    function loop(ms){
      raf=0;
      if(!on)return;
      raf=requestAnimationFrame(loop);
      if(LITE&&ms-last<32)return;          /* điện thoại: khoá ~30fps cho đỡ nóng máy */
      last=ms;
      const t=now();
      /* khi không có beat, tâm vẫn tự phát một vòng nhỏ mỗi 4 phách */
      if(t-lastIdle>1.94&&!api.beating){lastIdle=t;spawn(C[0],C[1],.35,false);}
      cx+=(mx-cx)*.05;cy+=(my-cy)*.05;punch*=.86;
      camera();draw(t);
    }
    function start(){if(!raf&&on)raf=requestAnimationFrame(loop);}
    new IntersectionObserver(es=>{on=es[0].isIntersecting&&!document.hidden;start();},{threshold:0}).observe(canvas);
    document.addEventListener('visibilitychange',()=>{on=!document.hidden;start();});
    addEventListener('resize',()=>{size();camera();});
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();on=false;canvas.dispatchEvent(new CustomEvent('hk-gl-lost',{bubbles:true}));});

    /* thao tác: rê chuột để camera nghiêng theo và để lại vệt sóng nhỏ,
       bấm / chạm để thả một vòng sóng đỏ đúng chỗ đó */
    const host=opts.pointer||canvas;
    host.addEventListener('pointermove',e=>{
      const r=host.getBoundingClientRect();
      mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1;
      if(e.pointerType==='mouse'&&performance.now()-lastMove>110){
        lastMove=performance.now();const p=toFloor(e.clientX,e.clientY);if(p)spawn(p[0],p[1],.22,false);
      }
    },{passive:true});
    host.addEventListener('pointerdown',e=>{
      if(e.target.closest('a,button'))return;
      const p=toFloor(e.clientX,e.clientY);if(p)spawn(p[0],p[1],.9,true);
    },{passive:true});

    const api={
      spawn,
      kick(){spawn(C[0],C[1],.8,true);punch=1;},
      beating:false,
      still:false
    };
    start();
    return api;
  }

  window.HKField={mount};
})();
