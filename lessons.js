// Lessons: one idea per card. f = interactive figure id
const TOPICS = [
{id:'reg',name:'Regression Model',th:'การถดถอยเชิงเส้นอย่างง่าย',n:15,cards:[
{h:'Predict a number',k:'Regression คือการสอนโมเดลให้ <b>ทายตัวเลข</b> จากข้อมูลที่มีคำตอบให้ดู',b:`<p>เรามีบ้านหลายหลังที่รู้ทั้ง <b>ขนาด</b> และ <b>ราคา</b> อยากได้สูตรที่ป้อนขนาดบ้านหลังใหม่แล้วได้ราคาออกมา</p>
<dl><dt>Feature (x)</dt><dd>ข้อมูลที่ป้อนเข้า สิ่งที่เรารู้ เช่น ขนาดบ้าน</dd>
<dt>Label / Target (y)</dt><dd>คำตอบจริงที่อยากทำนาย เช่น ราคาบ้าน</dd>
<dt>Supervised learning</dt><dd>การเรียนรู้ที่ข้อมูลเทรนมีคำตอบ y ให้ดูทุกตัวอย่าง Regression และ Classification อยู่ในกลุ่มนี้</dd>
<dt>Regression vs Classification</dt><dd>Regression ให้ค่าต่อเนื่อง (ราคา อุณหภูมิ) ส่วน Classification ให้หมวดหมู่ (ใช่/ไม่ใช่)</dd>
<dt>m</dt><dd>จำนวนตัวอย่างข้อมูลเทรน</dd></dl>`},
{h:'The model is a line',k:'โมเดลคือเส้นตรง <span class="f">ŷ = <i class="cw">w</i>x + <i class="cb">b</i></span>',b:`<dl><dt>ŷ (y-hat)</dt><dd>ค่าที่โมเดลทำนาย ต่างจาก y ที่เป็นค่าจริง</dd>
<dt class="cw">w (weight / slope)</dt><dd>ความชัน x เพิ่ม 1 หน่วย ŷ เพิ่ม w หน่วย</dd>
<dt class="cb">b (bias / intercept)</dt><dd>จุดตัดแกน y คือค่า ŷ ตอน x = 0</dd></dl>
<p>การ "เทรน" โมเดล คือการหาค่า w กับ b ที่ทำให้เส้นเข้ากับข้อมูลมากที่สุด ลองลากแถบด้านล่างดูว่าเส้นเปลี่ยนอย่างไร</p>`,f:'line'},
{h:'How wrong is the line?',k:'<b>Cost function</b> คือตัวเลขตัวเดียวที่บอกว่าเส้นนี้ทายผิดมากแค่ไหน',b:`<div class="formula">J(w,b) = <sup>1</sup>⁄<sub>2m</sub> Σ (ŷᵢ − yᵢ)²</div>
<dl><dt>Residual / error</dt><dd>ŷᵢ − yᵢ ผลต่างระหว่างค่าทายกับค่าจริงของจุดที่ i (เส้นประในกราฟ)</dd>
<dt>ยกกำลังสอง</dt><dd>ให้เป็นบวกเสมอ ไม่หักล้างกัน และลงโทษจุดที่ผิดมากหนักกว่า</dd>
<dt>Σ แล้วหาร</dt><dd>รวมทุกจุดแล้วเฉลี่ย เรียกว่า Mean Squared Error (MSE)</dd>
<dt>ทำไม 2m</dt><dd>ให้ตอนดิฟแล้ว 2 ตัดกันพอดี ไม่เปลี่ยนจุดต่ำสุด (sklearn หารด้วย m ตัวเลขจึงต่างกัน 2 เท่า)</dd></dl>
<p class="calc">ตัวอย่าง: x = [1, 2], y = [300, 500], w = 250, b = 100 → ŷ = [350, 600] → error = [50, 100] → 2500 + 10000 = 12500 → หาร 2×2 → <b>J = 3125</b></p>
<p>MSE ของ linear regression เป็นรูป <b>ชาม (convex)</b> มีจุดต่ำสุดจุดเดียว จึงหาได้แน่นอน</p>`},
{h:'Walk downhill',k:'<b>Gradient descent</b> ขยับ w, b ทีละก้าวไปทางที่ cost ลดลง',b:`<div class="formula">w := w − <i class="ca">α</i> · ∂J/∂w &nbsp;&nbsp; b := b − <i class="ca">α</i> · ∂J/∂b</div>
<dl><dt>∂J/∂w</dt><dd>(1/m) Σ (ŷᵢ − yᵢ) · xᵢ ความชันของ cost เทียบกับ w</dd>
<dt>∂J/∂b</dt><dd>(1/m) Σ (ŷᵢ − yᵢ) เหมือนกันแต่ไม่มี xᵢ คูณ</dd>
<dt>เครื่องหมายลบ</dt><dd>gradient ชี้ทางที่ cost <b>เพิ่ม</b> ลบออกจึงเดินลง</dd>
<dt class="ca">α (learning rate)</dt><dd>ขนาดก้าว ใหญ่เกินจะกระโดดข้ามจนแกว่งหรือระเบิด (diverge) เล็กเกินจะลู่เข้าช้ามาก</dd>
<dt>Batch GD</dt><dd>ใช้ข้อมูลทั้งหมดคำนวณ gradient ทุกรอบ</dd>
<dt>Converge</dt><dd>cost แทบไม่ลดแล้ว กราฟ cost vs iteration แบนราบ</dd></dl>
<p>ลองเปลี่ยน α แล้วดูว่าลูกบอลเดินลงชามอย่างไร</p>`,f:'gd'},
{h:'Fit well, not too well',k:'โมเดลที่ดีต้องทายข้อมูล <b>ใหม่</b> ได้ ไม่ใช่แค่จำข้อมูลเทรน',b:`<dl><dt>Underfitting (high bias)</dt><dd>โมเดลง่ายเกินไป ผิดเยอะทั้ง train และ test</dd>
<dt>Overfitting (high variance)</dt><dd>โมเดลจำ train ได้แทบหมดรวมถึง noise แต่ทายข้อมูลใหม่แย่</dd>
<dt>Regularization</dt><dd>เพิ่มพจน์ลงโทษ weight ใหญ่ เช่น Ridge (L2) บวก λΣw² เข้าไปใน cost ช่วยลด overfitting ถ้า λ ใหญ่เกินจะกลายเป็น underfit</dd>
<dt>R²</dt><dd>สัดส่วนความแปรปรวนของ y ที่โมเดลอธิบายได้ ใกล้ 1 ยิ่งดี เช่น 0.85 = อธิบายได้ 85%</dd>
<dt>Least squares (OLS)</dt><dd>หาเส้นที่ผลรวม residual ยกกำลังสองน้อยที่สุด</dd></dl>`}
]},
{id:'multi',name:'Multiple Regression',th:'การถดถอยหลายตัวแปร',n:15,cards:[
{h:'More than one feature',k:'ใช้หลาย feature ทำนาย y ตัวเดียว ทุก feature มี weight ของตัวเอง',b:`<div class="formula">ŷ = w₁x₁ + w₂x₂ + … + wₙxₙ + b = <b>w · x</b> + b</div>
<dl><dt>n</dt><dd>จำนวน feature parameter ทั้งหมดจึงมี n + 1 ตัว (w n ตัว + b)</dd>
<dt>xᵢⱼ</dt><dd>ค่าของ feature ที่ j ในตัวอย่างที่ i (i = แถว, j = คอลัมน์)</dd>
<dt>w · x (dot product)</dt><dd>คูณแต่ละคู่แล้วบวกกัน ใน numpy คือ np.dot(X, w)</dd>
<dt>Vectorization</dt><dd>คำนวณทุกแถวพร้อมกันด้วย numpy แทน for loop เร็วกว่าและโค้ดสั้น ผลลัพธ์เท่าเดิม</dd></dl>
<p>ลองปรับค่า feature ของบ้านแล้วดูว่าแต่ละส่วนรวมเป็นราคาอย่างไร</p>`,f:'multi'},
{h:'Same descent, more weights',k:'Gradient descent เหมือนเดิม แค่ทำกับ w ทุกตัว <b>พร้อมกัน</b>',b:`<div class="formula">wⱼ := wⱼ − α · <sup>1</sup>⁄<sub>m</sub> Σ (ŷᵢ − yᵢ) xᵢⱼ</div>
<dl><dt>Simultaneous update</dt><dd>คำนวณ gradient ของทุกตัวจากค่าเดิมก่อน แล้วค่อยอัปเดตพร้อมกัน</dd>
<dt>ในโค้ด</dt><dd>dw = (1/m)·np.dot(X.T, error) ได้ gradient ทุก feature ในบรรทัดเดียว db = np.mean(error)</dd>
<dt>Normal equation</dt><dd>w = (XᵀX)⁻¹Xᵀy หาคำตอบตรง ๆ ไม่ต้องวนรอบ ไม่ต้องเลือก α แต่ช้ามากเมื่อ n ใหญ่ (ต้อง invert เมทริกซ์ n×n)</dd></dl>`},
{h:'Put features on one scale',k:'<b>Feature scaling</b> ทำให้ทุก feature อยู่ช่วงใกล้กัน gradient descent จึงลู่เข้าเร็ว',b:`<p>รายได้เป็นหลักหมื่น แต่จำนวนห้องเป็นหลักหน่วย contour ของ cost จะรียาว gradient เดินซิกแซก</p>
<dl><dt>Standardization (Z-score)</dt><dd>z = (x − μ) / σ ได้ค่าเฉลี่ย 0 และ SD 1 ใน sklearn คือ StandardScaler</dd>
<dt>Min-max normalization</dt><dd>(x − min)/(max − min) ได้ช่วง 0 ถึง 1</dd>
<dt>μ, σ</dt><dd>ค่าเฉลี่ย และส่วนเบี่ยงเบนมาตรฐานของคอลัมน์นั้น</dd>
<dt>fit_transform</dt><dd>fit = หา μ, σ / transform = แปลงค่า ที่ถูกคือ fit บน train เท่านั้นเพื่อกัน data leakage</dd></dl>
<p class="calc">รายได้ 79545.46, μ = 68583.11, σ = 10656.93 → (79545.46 − 68583.11)/10656.93 = <b>1.03</b> คือสูงกว่าค่าเฉลี่ย 1.03 σ</p>`,f:'scale'},
{h:'Curves with a linear model',k:'<b>Polynomial regression</b> คือสร้าง feature ใหม่ x², x³ แล้วใช้ linear regression ตามเดิม',b:`<dl><dt>Feature engineering</dt><dd>สร้าง/แปลง feature จากความรู้เรื่องปัญหา เช่น พื้นที่ = กว้าง × ยาว</dd>
<dt>ต้อง scale</dt><dd>x³ มีช่วงค่ากว้างกว่า x มาก</dd>
<dt>Degree สูงเกิน</dt><dd>เส้นวิ่งผ่านทุกจุดรวม noise = overfitting</dd>
<dt>Multicollinearity</dt><dd>feature หลายตัวสัมพันธ์กันสูง (เช่น ตร.ม. กับ ตร.ฟุต) ทำให้ weight ไม่เสถียร แปลความหมายยาก</dd>
<dt>Correlation (r)</dt><dd>ค่า −1 ถึง 1 บอกทิศและความแรงของความสัมพันธ์เชิงเส้น ไม่ได้พิสูจน์เหตุ-ผล</dd></dl>`},
{h:'Measure the error',k:'Error ยิ่ง <b>น้อย</b> ยิ่งดี ส่วน R² ยิ่ง <b>มาก</b> ยิ่งดี',b:`<dl><dt>MSE</dt><dd>เฉลี่ยของ (y − ŷ)² หน่วยเป็น y² ลงโทษความผิดใหญ่หนัก</dd>
<dt>RMSE</dt><dd>√MSE หน่วยกลับเป็นหน่วยของ y</dd>
<dt>MAE</dt><dd>เฉลี่ยของ |y − ŷ| หน่วยเดียวกับ y ไวต่อ outlier น้อยกว่า</dd>
<dt>MAPE</dt><dd>เฉลี่ยของ |y − ŷ|/y × 100% เทียบข้ามข้อมูลต่างสเกลได้</dd>
<dt>R²</dt><dd>1 − SS_res/SS_tot ใกล้ 1 ดี จะไม่ลดลงเมื่อเพิ่ม feature</dd>
<dt>Adjusted R²</dt><dd>ลงโทษการเพิ่ม feature ที่ไม่ช่วยอธิบาย y</dd>
<dt>Train/test split</dt><dd>เก็บข้อมูลส่วนหนึ่งไว้วัดผลบนข้อมูลที่โมเดลไม่เคยเห็น</dd></dl>`}
]},
{id:'logit',name:'Logistic Regression',th:'การถดถอยโลจิสติก',n:15,cards:[
{h:'Yes or no',k:'Logistic regression ใช้ <b>จำแนกคลาส</b> แม้ชื่อจะมีคำว่า regression',b:`<dl><dt>Binary classification</dt><dd>คำตอบมี 2 คลาส: 0 (negative) กับ 1 (positive) เช่น ไม่เป็นโรค/เป็นโรค</dd>
<dt>ทำไมไม่ใช้ linear regression</dt><dd>เส้นตรงให้ค่าเกิน 1 หรือติดลบได้ และ outlier ดึงเส้นจนแบ่งคลาสผิด</dd></dl>`},
{h:'Squash it with a sigmoid',k:'คำนวณ z เป็นเส้นตรงเหมือนเดิม แล้วบีบด้วย <b>sigmoid</b> ให้เป็นความน่าจะเป็น',b:`<div class="formula">z = w · x + b &nbsp;&nbsp; ŷ = σ(z) = <sup>1</sup>⁄<sub>1 + e⁻ᶻ</sub></div>
<dl><dt>σ(z)</dt><dd>อยู่ระหว่าง 0 ถึง 1 เสมอ σ(0) = 0.5, z → +∞ ได้ 1, z → −∞ ได้ 0</dd>
<dt>ŷ</dt><dd>ความน่าจะเป็นที่เป็นคลาส 1 คือ P(y = 1 | x)</dd>
<dt>Threshold</dt><dd>ŷ ≥ 0.5 ทาย 1 ซึ่งเท่ากับ z ≥ 0</dd>
<dt>Odds / log-odds</dt><dd>odds = p/(1−p) และ z = ln(odds) จึงเรียก z ว่า logit</dd>
<dt>weight บวก</dt><dd>feature เพิ่ม → ความน่าจะเป็นคลาส 1 เพิ่ม</dd></dl>`,f:'sigmoid'},
{h:'The decision boundary',k:'<b>Decision boundary</b> คือที่ที่ z = 0 แบ่งพื้นที่ทาย 0 กับทาย 1',b:`<dl><dt>Feature เส้นตรง</dt><dd>w₁x₁ + w₂x₂ + b = 0 คือเส้นตรง</dd>
<dt>Polynomial features</dt><dd>เพิ่ม x₁², x₂² ทำให้ boundary เป็นวงกลมหรือเส้นโค้งได้</dd>
<dt>One-vs-All</dt><dd>K คลาส สร้าง binary classifier K ตัว แต่ละตัวแยก "คลาสนี้ vs ที่เหลือ" แล้วเลือกคลาสที่ความน่าจะเป็นสูงสุด</dd></dl>`},
{h:'Log loss, not MSE',k:'ใช้ <b>log loss</b> เพราะ MSE ที่ผ่าน sigmoid เป็น non-convex',b:`<div class="formula">L = −[ y·log(ŷ) + (1 − y)·log(1 − ŷ) ]</div>
<dl><dt>y = 1</dt><dd>เหลือ −log(ŷ) ทาย ŷ ใกล้ 1 loss ใกล้ 0, ใกล้ 0 loss พุ่งไปอนันต์</dd>
<dt>y = 0</dt><dd>เหลือ −log(1 − ŷ) กลับกัน</dd>
<dt>Convex</dt><dd>log loss มีจุดต่ำสุดเดียว gradient descent ไม่ติด local minimum</dd>
<dt>Gradient</dt><dd>(1/m)Σ(ŷᵢ − yᵢ)xᵢⱼ หน้าตาเหมือน linear แต่ ŷ = σ(z)</dd>
<dt>Regularization</dt><dd>ใน sklearn ใช้ C = 1/λ, C เล็ก = regularize แรง</dd></dl>`},
{h:'Count right and wrong',k:'<b>Confusion matrix</b> นับคำทำนายเป็น 4 ช่อง แล้วคิดตัววัดทั้งหมดจากตรงนั้น',b:`<dl><dt>TP</dt><dd>จริง 1 ทาย 1</dd><dt>TN</dt><dd>จริง 0 ทาย 0</dd>
<dt>FP</dt><dd>จริง 0 แต่ทาย 1 (เตือนผิด)</dd><dt>FN</dt><dd>จริง 1 แต่ทาย 0 (พลาดคนป่วย)</dd>
<dt>Accuracy</dt><dd>(TP + TN)/ทั้งหมด หลอกตาเมื่อข้อมูลไม่สมดุล</dd>
<dt>Precision</dt><dd>TP/(TP + FP) ในที่ทายว่า 1 ถูกจริงกี่ส่วน (สำคัญเมื่อ FP แพง เช่น spam)</dd>
<dt>Recall</dt><dd>TP/(TP + FN) ในที่เป็น 1 จริง จับได้กี่ส่วน (สำคัญเมื่อ FN แพง เช่น มะเร็ง)</dd>
<dt>F1</dt><dd>2PR/(P + R) ค่าเฉลี่ยฮาร์มอนิก</dd>
<dt>ลด threshold</dt><dd>ทาย 1 มากขึ้น recall ขึ้น precision มักลง</dd></dl>
<p>แตะช่องเพื่อเพิ่ม/ลดค่า แล้วดูตัววัดเปลี่ยน</p>`,f:'cm'}
]},
{id:'clus',name:'Clustering',th:'การจัดกลุ่ม',n:15,cards:[
{h:'No answers given',k:'Clustering จัดข้อมูลที่ <b>คล้ายกัน</b> ไว้กลุ่มเดียวกัน โดยไม่มี label',b:`<dl><dt>Unsupervised learning</dt><dd>ข้อมูลไม่มีคำตอบ y โมเดลหาโครงสร้างเอง</dd>
<dt>เป้าหมาย</dt><dd>ในกลุ่มใกล้กัน ต่างกลุ่มห่างกัน</dd>
<dt>ใช้งาน</dt><dd>แบ่งกลุ่มลูกค้า จัดกลุ่มเอกสาร บีบอัดสีภาพ หา anomaly</dd>
<dt>Euclidean</dt><dd>√Σ(aᵢ − bᵢ)² ระยะเส้นตรง (1,2)→(4,6) = 5</dd>
<dt>Manhattan</dt><dd>Σ|aᵢ − bᵢ| ระยะเดินตามบล็อก (1,2)→(4,6) = 7</dd>
<dt>Scaling</dt><dd>ต้อง scale ก่อน เพราะ feature ค่าใหญ่จะครอบงำระยะทาง</dd></dl>`},
{h:'K-means',k:'K-means สลับสองขั้น: <b>จัดจุดเข้ากลุ่ม</b> แล้ว <b>ย้าย centroid</b> จนไม่เปลี่ยน',b:`<dl><dt>K</dt><dd>จำนวนกลุ่ม ต้องกำหนดเอง</dd>
<dt>Centroid</dt><dd>จุดศูนย์กลางกลุ่ม = ค่าเฉลี่ยของจุดในกลุ่ม</dd>
<dt>1. Initialize</dt><dd>สุ่ม K centroid (หรือ k-means++ ที่เลือกให้กระจายห่างกัน)</dd>
<dt>2. Assign</dt><dd>แต่ละจุดเข้ากลุ่มของ centroid ที่ใกล้ที่สุด</dd>
<dt>3. Update</dt><dd>ย้าย centroid ไปที่ค่าเฉลี่ยของสมาชิก</dd>
<dt>4. Repeat</dt><dd>จนการจัดกลุ่มไม่เปลี่ยน (converge)</dd>
<dt>Distortion / Inertia / WCSS</dt><dd>Σ ระยะ² จากจุดถึง centroid ของตัวเอง ไม่เพิ่มขึ้นในแต่ละรอบ</dd>
<dt>Local optimum</dt><dd>ผลขึ้นกับจุดเริ่ม จึงรันหลายครั้ง (n_init) เลือกที่ inertia ต่ำสุด</dd></dl>
<p>กดปุ่มใต้กราฟเพื่อดู k-means ทำงานทีละขั้น</p>`,f:'kmeans'},
{h:'Choosing K',k:'Distortion ลดลงเสมอเมื่อเพิ่ม K จึงต้องดู <b>จุดหักศอก</b> หรือ silhouette',b:`<dl><dt>Elbow method</dt><dd>พล็อต inertia เทียบกับ K เลือก K ตรงที่กราฟหักโค้งแล้วลดลงช้า</dd>
<dt>Silhouette</dt><dd>s = (b − a)/max(a, b) ช่วง −1 ถึง 1 ใกล้ 1 ดี</dd>
<dt>a</dt><dd>ระยะเฉลี่ยกับจุดในกลุ่มเดียวกัน</dd>
<dt>b</dt><dd>ระยะเฉลี่ยกับจุดในกลุ่มที่ใกล้ที่สุดถัดไป</dd>
<dt>ข้อจำกัด K-means</dt><dd>ถนัดกลุ่มทรงกลมขนาดใกล้กัน ไวต่อ outlier ต้องรู้ K</dd>
<dt>sklearn</dt><dd>cluster_centers_ = centroid, labels_ = กลุ่มของแต่ละจุด, inertia_ = WCSS</dd></dl>`,f:'elbow'},
{h:'Build a tree',k:'<b>Hierarchical clustering</b> รวมกลุ่มที่ใกล้ที่สุดทีละคู่ แล้ววาดเป็นต้นไม้',b:`<dl><dt>Agglomerative</dt><dd>bottom-up เริ่มทุกจุดเป็นกลุ่มของตัวเอง รวมทีละคู่จนเหลือกลุ่มเดียว</dd>
<dt>Divisive</dt><dd>top-down เริ่มจากกลุ่มเดียวแล้วแบ่งลง</dd>
<dt>Dendrogram</dt><dd>แผนภาพต้นไม้ ตัดที่ความสูงต่างกันได้จำนวนกลุ่มต่างกัน ไม่ต้องกำหนด K ก่อน</dd>
<dt>Single linkage</dt><dd>ระยะคู่จุดที่ <b>ใกล้</b> ที่สุด มักเกิดโซ่ (chaining)</dd>
<dt>Complete linkage</dt><dd>ระยะคู่จุดที่ <b>ไกล</b> ที่สุด ได้กลุ่มกะทัดรัด</dd>
<dt>Average linkage</dt><dd>ระยะเฉลี่ยของทุกคู่</dd></dl>`},
{h:'Follow the density',k:'<b>DBSCAN</b> ถือว่าบริเวณที่จุดอยู่หนาแน่นต่อกันคือกลุ่มเดียว',b:`<dl><dt>eps (ε)</dt><dd>รัศมีที่ใช้นับเพื่อนบ้าน</dd>
<dt>minPts</dt><dd>จำนวนเพื่อนบ้านขั้นต่ำที่จะเป็น core</dd>
<dt>Core point</dt><dd>มีเพื่อนบ้านในรัศมี eps ≥ minPts</dd>
<dt>Border point</dt><dd>ไม่ใช่ core แต่อยู่ในรัศมีของ core</dd>
<dt>Noise</dt><dd>ไม่ใช่ทั้งสองแบบ = outlier</dd>
<dt>ข้อดี</dt><dd>ไม่ต้องกำหนด K หากลุ่มรูปทรงแปลก (moons, วงแหวน) ได้ แยก noise ได้</dd></dl>`}
]},
{id:'lab',name:'Lab 1–3',th:'โค้ด numpy, pandas, sklearn',n:20,cards:[
{h:'Lab 1: one feature',k:'บ้าน 2 หลัง หา w, b ด้วย gradient descent เอง แล้วทำซ้ำด้วย sklearn',b:`<pre>w, b, alpha = 250, 100, 0.01
for i in range(10000):
    y_hat = w * X_train + b
    dw = (1/m) * np.sum((y_hat - y_train) * X_train)
    db = (1/m) * np.sum(y_hat - y_train)
    w, b = w - alpha*dw, b - alpha*db</pre>
<p class="calc">รอบแรก: error = [50, 100] → dw = (50·1 + 100·2)/2 = 125 → w = 250 − 0.01×125 = <b>248.75</b>, db = 75 → b = <b>99.25</b> สุดท้ายได้ w ≈ 200, b ≈ 100</p>
<pre>model = LinearRegression()
model.fit(X_train.reshape(-1, 1), y_train)
model.coef_, model.intercept_      # w, b
model.predict(np.array([20]).reshape(-1, 1))</pre>
<dl><dt>reshape(-1, 1)</dt><dd>sklearn ต้องการ X 2 มิติ (แถว = ตัวอย่าง, คอลัมน์ = feature) −1 ให้ numpy คิดจำนวนแถวเอง ลืมจะ error "Expected 2D array"</dd>
<dt>y</dt><dd>เป็น 1 มิติได้ ไม่ต้อง reshape</dd>
<dt>coef_ / intercept_</dt><dd>w (เป็น array) / b ตัวอย่าง 227.70 × 20 + 60.67 ≈ 4614.6</dd></dl>`},
{h:'Lab 2: house prices',k:'5000 บ้าน 5 feature: สำรวจ ทำความสะอาด scale แบ่ง เทรน วัดผล',b:`<pre>data = pd.read_csv('USA_Housing.csv')
data.head(); data.info(); data.describe()
data.isnull().sum()                 # นับค่าว่างต่อคอลัมน์
data = data.drop('Address', axis=1) # axis=1 = คอลัมน์
sns.heatmap(data.corr()); sns.histplot(data.Price)
X = data.drop('Price', axis=1); y = data['Price']
X = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)</pre>
<dl><dt>Correlation สูงสุด</dt><dd>Avg. Area Income ≈ 0.64 ห้องนอนต่ำสุด</dd>
<dt>random_state</dt><dd>สุ่มแบ่งได้ผลเดิมทุกครั้ง</dd>
<dt>ขนาด</dt><dd>X_train (3500, 5), X_test (1500, 5)</dd>
<dt>GD เอง</dt><dd>w = np.zeros(5), ŷ = np.dot(X, w) + b, dw = (1/m)·np.dot(X.T, error), db = np.mean(error)</dd>
<dt>ตัววัด</dt><dd>mean_squared_error, mean_absolute_error, r2_score และ MAPE คิดเองได้ 7.34%</dd></dl>`},
{h:'Lab 3: heart disease',k:'ทาย TenYearCHD (0/1) ด้วย LogisticRegression ข้อมูลไม่สมดุล',b:`<pre>data.dropna(inplace=True)
data.reset_index(drop=True, inplace=True)  # 4238 → 3656 แถว
data.TenYearCHD.value_counts()             # 0: 3099, 1: 557
Xs = X.copy()
Xs[num_cols] = StandardScaler().fit_transform(X[num_cols])
X_train, X_test, y_train, y_test = train_test_split(
    Xs, y, test_size=0.3, random_state=42, stratify=y)
model = LogisticRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)             # 0 หรือ 1</pre>
<dl><dt>dropna / inplace</dt><dd>ลบแถวที่มีค่าว่าง แก้ใน DataFrame เดิม glucose หายมากสุด 388</dd>
<dt>scale บางคอลัมน์</dt><dd>คอลัมน์ 0/1 เช่น male, currentSmoker ไม่ต้อง scale</dd>
<dt>stratify=y</dt><dd>คงสัดส่วนคลาสเดิมทั้งใน train และ test</dd>
<dt>predict_proba</dt><dd>ได้ความน่าจะเป็นแทนคลาส</dd></dl>`},
{h:'Lab 3: read the results',k:'Accuracy 0.86 ดูดี แต่ recall แค่ 0.10 โมเดลพลาดคนป่วยเกือบหมด',b:`<pre>confusion_matrix(y_test, y_pred)
# [[925   5]     แถว = จริง, คอลัมน์ = ทาย
#  [150  17]]    [[TN FP] [FN TP]]</pre>
<p class="calc">Accuracy = (925 + 17)/1097 = <b>0.859</b> &nbsp; Precision = 17/22 = <b>0.773</b> &nbsp; Recall = 17/167 = <b>0.102</b> &nbsp; F1 ≈ <b>0.18</b> &nbsp; MCC ≈ <b>0.25</b></p>
<dl><dt>ทาย 0 ทุกคน</dt><dd>ได้ accuracy 930/1097 = 0.848 อยู่แล้ว</dd>
<dt>MCC</dt><dd>−1 ถึง 1 ใช้ทั้ง 4 ช่อง 0 = เหมือนสุ่ม เชื่อถือได้กับข้อมูลไม่สมดุล</dd>
<dt>classification_report</dt><dd>precision, recall, f1 แยกต่อคลาส support = จำนวนจริงของคลาส</dd>
<dt>ลำดับอาร์กิวเมนต์</dt><dd>metric(y_true, y_pred) ค่าจริงก่อนเสมอ</dd></dl>`}
]}
];
