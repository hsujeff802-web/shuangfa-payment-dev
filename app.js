const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='shuangfa_payment_v52',BACKUP_KEY='shuangfa_payment_v52_snaps',SETTINGS_KEY='shuangfa_payment_v52_settings';
const MASTER_VENDORS=[{"code":"0001","name":"鉅寶-進寶塑膠(股)公司"},{"code":"0002","name":"廣信企業(股)公司"},{"code":"0003","name":"鑫進企業有限公司"},{"code":"0004","name":"何省輝"},{"code":"0005","name":"啟錄企業有限公司"},{"code":"0006","name":"和興塑膠廠有限公司022-2228758"},{"code":"0007","name":"棋新實業有限公司"},{"code":"0008","name":"新光陽-華南有限公司"},{"code":"0009","name":"久奇新塑膠產品有限公司"},{"code":"0010","name":"海山-海地工業有限公司"},{"code":"0011","name":"樹鴻-世凱塑膠廠"},{"code":"0012","name":"三厘實業股份有限公司"},{"code":"0013","name":"有翔塑膠有限公司"},{"code":"0015","name":"聯大橡膠廠"},{"code":"0016","name":"萬隆塑膠工廠"},{"code":"0017","name":"佑任機材工業有限公司"},{"code":"0018","name":"裕榮塑膠工業(股)公司"},{"code":"0019","name":"奇威"},{"code":"0020","name":"正振豐塑膠廠"},{"code":"0021","name":"和增泰企業有限公司"},{"code":"0022","name":"凡特電業有限公司"},{"code":"0023","name":"一品陶瓷-許根煙"},{"code":"0024","name":"電光-振吉電化廠股份有限公司"},{"code":"0025","name":"德仕特股份有限公司"},{"code":"0026","name":"三友"},{"code":"0028","name":"帝后-佑普企業有限公司"},{"code":"0030","name":"福港行"},{"code":"0031","name":"德昌水塔有限公司 (前信昌侄子)"},{"code":"0032","name":"鑫昌水塔行"},{"code":"0033","name":"名展不銹鋼行"},{"code":"0034","name":"宏欣五金工業社"},{"code":"0035","name":"政原企業有限公司(國光)"},{"code":"0036","name":"良吉銅器工業股份有限公司"},{"code":"0037","name":"藍英-盛興工業社"},{"code":"0038","name":"久王企業社"},{"code":"0039","name":"大金五金工業社"},{"code":"0040","name":"禾圳實業有限公司"},{"code":"0041","name":"永昌五金工業社(信宇牌)"},{"code":"0042","name":"南成大塑膠金屬工廠"},{"code":"0043","name":"山川興業有限公司"},{"code":"0044","name":"敬群五金有限公司"},{"code":"0045","name":"鑫城實業有限公司(金鐘)"},{"code":"0046","name":"東祥實業社"},{"code":"0047","name":"宜陸企業有限公司"},{"code":"0049","name":"博麟水電材料有限公司"},{"code":"0050","name":"岱勁企業有限公司 (理想)"},{"code":"3153","name":"鴻茂工業股份有限公司"},{"code":"0052","name":"興泉發科技有限公司"},{"code":"0053","name":"坤慶精機股份有限公司"},{"code":"0054","name":"名俊企業社"},{"code":"0055","name":"東北瓦斯器具"},{"code":"0057","name":"水星"},{"code":"0058","name":"啟峰消防企業有限公司"},{"code":"0059","name":"銀箭股份有限公司"},{"code":"0060","name":"凱旋工業股份有限公司"},{"code":"0061","name":"鑫和冠企業股份有限公司"},{"code":"0062","name":"九龍飲水機有限公司"},{"code":"0064","name":"學文廚具批發中心"},{"code":"0065","name":"欣欣廚具批發總匯"},{"code":"0067","name":"佳龍電熱水器"},{"code":"0068","name":"忠進電機有限公司"},{"code":"0069","name":"東頤電機有限公司"},{"code":"0070","name":"順光股份有限公司 (壢光)"},{"code":"0071","name":"瑜峰電機企業有限公司 (南崁工業"},{"code":"0072","name":"金光(台金電料行)"},{"code":"0073","name":"信發 (年登電料行)凱揚"},{"code":"0074","name":"梅喬"},{"code":"0075","name":"益成行"},{"code":"0076","name":"建源-升嘉工業有限公司"},{"code":"0077","name":"正大"},{"code":"0078","name":"政勇"},{"code":"0079","name":"千代電器廠"},{"code":"0080","name":"照華"},{"code":"0081","name":"吉助五金行"},{"code":"0082","name":"四維企業(股)公司"},{"code":"0083","name":"黑寶"},{"code":"0084","name":"三山興業有限公司"},{"code":"0085","name":"正儀實業股份有限公司"},{"code":"0086","name":"榮立陶器工業有限公司"},{"code":"0087","name":"力山企業社"},{"code":"0088","name":"政昌"},{"code":"0089","name":"錫隆企業(股)公司"},{"code":"0090","name":"曙昇"},{"code":"0091","name":"連盛電料廠"},{"code":"0092","name":"鋒電企業有限公司 (震洋)"},{"code":"0093","name":"祥順"},{"code":"0094","name":"金至興業有限公司"},{"code":"0095","name":"妙合電子企業商"},{"code":"0096","name":"久揚電子電信有限公司"},{"code":"0097","name":"意順實業有限公司"},{"code":"0098","name":"皇冠企業社"},{"code":"0099","name":"王冠自動控制(股)公司"},{"code":"0100","name":"瑞宙實業有限公司 (慶吉企業有限"},{"code":"0101","name":"豐利(勝傑企業有限公司"},{"code":"0102","name":"正廉實業有公司 (重陽)"},{"code":"0103","name":"裕泰電線電纜有限公司"},{"code":"0104","name":"岳陽電線電纜股份有限公司"},{"code":"0105","name":"鑫春元"},{"code":"0106","name":"東榮電線電纜有限公司"},{"code":"0107","name":"聯盟電線電纜有限公司"},{"code":"0108","name":"仕勳鋼鐵有限公司 (錫仕)"},{"code":"0109","name":"久為鋼鐵有限公司"},{"code":"0110","name":"新鉅成-伸鉅大金屬工業股份有限"},{"code":"0111","name":"鹿鋼企業(股)公司"},{"code":"0112","name":"耕達不銹鋼股份有限公司"},{"code":"0113","name":"璉璋五金股份有限公司"},{"code":"0114","name":"順生行有限公司 宅-022-8097066"},{"code":"0115","name":"德和金屬工業(股)公司"},{"code":"0116","name":"昌幸有限公司"},{"code":"0117","name":"朝建五金有限公司"},{"code":"0118","name":"和生工業公司"},{"code":"0119","name":"和祥"},{"code":"0120","name":"金口金屬股份有限公司"},{"code":"0121","name":"總昌配管股份有限公司"},{"code":"0122","name":"XVJ"},{"code":"0123","name":"瑞成"},{"code":"0124","name":"海孚凡而工業(股)公司"},{"code":"0125","name":"進榮行"},{"code":"0126","name":"益鴻"},{"code":"0127","name":"衡錩五金實業有限公司"},{"code":"0128","name":"三佳工業社"},{"code":"0129","name":"金川口"},{"code":"0130","name":"德清企業行 (德鑽企業股份有限公"},{"code":"0131","name":"喜利帝(股)公司-(喜得釘)"},{"code":"0132","name":"博仕實業有限公司"},{"code":"0134","name":"信興-華郁企業社-化糞池"},{"code":"0135","name":"青輪-士元工業有限公司"},{"code":"0136","name":"噴聲企業有限公司"},{"code":"0138","name":"台灣日光燈公司(中壢營業所)"},{"code":"0139","name":"東亞-中國電器(股)公司3264"},{"code":"0141","name":"國豐電業社"},{"code":"0142","name":"名流燈飾行"},{"code":"0143","name":"威松電機(股)公司"},{"code":"0145","name":"慶鴻電機有限公司"},{"code":"0146","name":"信泰電機行"},{"code":"0147","name":"旭捷電線電纜有限公司"},{"code":"0148","name":"名亮行"},{"code":"0149","name":"佑承企業有限公司-建昇"},{"code":"0150","name":"欣錩金屬股份有限公司"},{"code":"0151","name":"懿泰工程有限公司"},{"code":"0152","name":"虹光企業股份有限公司"},{"code":"0153","name":"北新電業社"},{"code":"0155","name":"直光企業股份有限公司"},{"code":"0156","name":"日騰工業股份有限公司"},{"code":"0157","name":"興躍興業有限公司 (山川牌)"},{"code":"0159","name":"和盛五金工廠 晚04-7712170  093"},{"code":"0160","name":"成龍塑膠廠股份有限公司"},{"code":"0161","name":"雷勵企業商行"},{"code":"0162","name":"竹喜有限公司"},{"code":"0163","name":"鎔運工業股份有限公司"},{"code":"0164","name":"藍英銅器工廠"},{"code":"0165","name":"盛工企業有限公司"},{"code":"0167","name":"一嘉隆燈飾"},{"code":"0168","name":"泰亦膠業股份有限公司"},{"code":"0169","name":"上亮工業有限公司"},{"code":"0170","name":"新川王實業有限公司"},{"code":"0171","name":"聯誼會"},{"code":"0172","name":"達茂企業商行 (辰鶯)"},{"code":"0173","name":"台振企業有限公司"},{"code":"0174","name":"釱富鐵管企業有限公司"},{"code":"0175","name":"固浴銅器工廠"},{"code":"0178","name":"建同 (阿華)"},{"code":"0179","name":"全和電氣有限公司"},{"code":"0181","name":"金琪企業有限公司"},{"code":"0182","name":"同記玻纖維有限公司"},{"code":"0184","name":"新生五金工廠股份有限公司"},{"code":"0186","name":"修附電機股份有限公司"},{"code":"0187","name":"松益實業有限公司"},{"code":"0188","name":"普仁衛浴建材有限公司(TOTO衛浴)"},{"code":"0190","name":"莊頭北工業股份有限公司(TOTO)"},{"code":"0191","name":"德昌手套企業社"},{"code":"0192","name":"亞昌水塔"},{"code":"0194","name":"三華照明有限公司 022-9823126"},{"code":"0195","name":"台灣琺瑯工業股份有限公司"},{"code":"0196","name":"振昇貿易有限公司"},{"code":"0197","name":"寶勝電器材料有限公司(士林&富士"},{"code":"0198","name":"全鑫電機有限公司"},{"code":"0199","name":"東英(小便斗感應器)"},{"code":"0201","name":"佰吉企業有限公司"},{"code":"0202","name":"神功企業有限公司(組合活動側所)"},{"code":"0203","name":"名人照明有限公司"},{"code":"0204","name":"川雄企業有限公司 (瓦斯)"},{"code":"0205","name":"漢昇電業行"},{"code":"0206","name":"宸揚企業有限公司"},{"code":"0207","name":"偉達企業社"},{"code":"0208","name":"看新銅器有限公司"},{"code":"0209","name":"海洋行 (陳盈升)"},{"code":"0210","name":"瞬錩銅器"},{"code":"0211","name":"許子源"},{"code":"0212","name":"獅湖自動化工程有限公司"},{"code":"0213","name":"全洋精機銅器工廠 (賀洋)"},{"code":"0214","name":"杜威實業有限公司(電動馬桶)"},{"code":"0215","name":"冠豫企業有限公司(華冠牌)"},{"code":"0216","name":"一正電子(股)公司"},{"code":"0217","name":"元暉工業股份有限公司"},{"code":"0218","name":"森錩股份有限公司"},{"code":"0219","name":"鈺川行"},{"code":"0224","name":"永誠玻璃纖維有限公司"},{"code":"0226","name":"新豐泰有限公司"},{"code":"0227","name":"德峰電線電纜有限公司"},{"code":"0228","name":"台灣法瑯工業股份有限公司"},{"code":"0230","name":"中太照明(美楊燈飾)"},{"code":"0232","name":"普及電業股份有限公司0938-17938"},{"code":"0233","name":"王鼎電線電纜有線公司"},{"code":"0237","name":"百洲企業有限公司"},{"code":"0238","name":"宏昇馬達"},{"code":"0239","name":"英群電器工業股份有限公司"},{"code":"0240","name":"金大發企業有限公司(隆昌)"},{"code":"0241","name":"士盛配管材料有限公司"},{"code":"0242","name":"三優廚具精品公司"},{"code":"0243","name":"宏和行"},{"code":"0244","name":"台灣漿造工業有限公司"},{"code":"0251","name":"艾馬國際有限公司 (西德工具)"},{"code":"0252","name":"協興實業有限公司(按摩浴缸)"},{"code":"0253","name":"智揚企業有限公司(辛巴達熱水爐)"},{"code":"0254","name":"興德展實業有限公司 (中壢德久)"},{"code":"0255","name":"億年水塔企業有限公司"},{"code":"0256","name":"普利衛浴器材實業有限公司"},{"code":"0257","name":"和高五金有限公司(原英高)"},{"code":"0259","name":"熊威興業股份有限公司(百工)"},{"code":"0261","name":"日通行080461025"},{"code":"0263","name":"常將實業有限公司(美國路易士熱"},{"code":"0264","name":"日日興有限公司(美國豪門熱水爐)"},{"code":"0273","name":"指揮家科技有限公司"},{"code":"0276","name":"久欣順有限公司(亮榮)"},{"code":"0277","name":"尚美專業照明(吊扇)"},{"code":"0279","name":"和成服務站(假日有服務.維修)"},{"code":"0280","name":"柏拉圖燈飾(評好進口燈)"},{"code":"0286","name":"石松-洗孔"},{"code":"0290","name":"厚記企業有限公司"},{"code":"1021","name":"晨光太陽能源熱學科技有限公司"},{"code":"1025","name":"噴聲企業有限公司"},{"code":"1026","name":"國產爐具商行"},{"code":"1035","name":"北極冷凍空調"},{"code":"1036","name":"裕澄實業股份有限公司"},{"code":"1050","name":"恆立電氣有限公司(永勝電機)"},{"code":"1062","name":"達揚通信企業有限公司"},{"code":"1092","name":"昌幸有限公司"},{"code":"1094","name":"信泰電機行"},{"code":"1097","name":"朝群有限公司"},{"code":"1100","name":"吳昭龍(白河)"},{"code":"1167","name":"仲和企業有限公司"},{"code":"1168","name":"銘鎏照明燈飾股份有限公司"},{"code":"1169","name":"卓達企業有限公司"},{"code":"1170","name":"欣桃爐具"},{"code":"1172","name":"宏昌行"},{"code":"1175","name":"龍翔水電衛浴材料行"},{"code":"1179","name":"佳興水電材料行"},{"code":"1182","name":"世如企業有限公司"},{"code":"1195","name":"吉豐"},{"code":"1197","name":"玉誠水電材料行"},{"code":"1207","name":"光暉水電材料行"},{"code":"1233","name":"伊池企業有限公司 (伊斯曼衛浴)"},{"code":"1236","name":"瑩寶實業有限公司"},{"code":"1250","name":"承特水電材料有限公司"},{"code":"1251","name":"萬新水電材料行"},{"code":"1253","name":"元昇水電材料行"},{"code":"1254","name":"新興水電材料行"},{"code":"1255","name":"至聖水電材料行"},{"code":"1256","name":"高德水電材料行"},{"code":"1257","name":"建昇水電材料行"},{"code":"1258","name":"正豐水電材料行"},{"code":"1259","name":"家榮水電材行"},{"code":"1260","name":"和春水電材料行"},{"code":"1266","name":"大榮會計師"},{"code":"1267","name":"樹德企業股份有限公司"},{"code":"1273","name":"科聚工業有限公司"},{"code":"1288","name":"福揚水電材料行"},{"code":"1296","name":"台灣電熱工業股份有限公司(台熱)"},{"code":"1312","name":"千達水電材料行"},{"code":"1332","name":"英杰"},{"code":"1358","name":"全譔實業有限公司 (飛利浦桃園區"},{"code":"1360","name":"生昇電腦"},{"code":"1361","name":"海灣工業電氣材料行(強力風扇)"},{"code":"1362","name":"緯承興業(股)公司(大開關,插座)"},{"code":"1367","name":"巨廣企業有限公司"},{"code":"1370","name":"生原家電(股)公司"},{"code":"1371","name":"遠東企業社(幸福牌)"},{"code":"1378","name":"泰聯企業有限公司107"},{"code":"1380","name":"復陞五金企業有限公司"},{"code":"1385","name":"直昇電梯"},{"code":"1389","name":"有皇實業(股)公司"},{"code":"1390","name":"名人職業訓練中心"},{"code":"1391","name":"欣桃天然瓦斯公司"},{"code":"1395","name":"巨光廚具衛浴燈飾批發中心"},{"code":"1403","name":"家佳欣業有限公司"},{"code":"1406","name":"偉達船貨五金材料行"},{"code":"1412","name":"黃金-王爺銅器企業株式會社"},{"code":"1414","name":"嶸豐實業有限公司(延長線)"},{"code":"1417","name":"立可思(股)公司(三宇淨水)"},{"code":"1418","name":"同信工業社(贏順)"},{"code":"1421","name":"仟詠實業(股)公司(明光鏡箱)0800"},{"code":"1425","name":"玄峰燈飾"},{"code":"1431","name":"環亞照明"},{"code":"1432","name":"共笙實業有限公司"},{"code":"1438","name":"晉盟股份有限公司"},{"code":"1439","name":"弘茂企業有限公司(澳洲淋浴拉門)"},{"code":"1442","name":"金閃亮專業照明(川豐)"},{"code":"1444","name":"余家義(驗車)"},{"code":"1445","name":"孟德國際有限公司"},{"code":"1449","name":"汎球行有限公司"},{"code":"1455","name":"泉昌企業有限公司"},{"code":"1461","name":"仁興金屬(股)公司"},{"code":"1463","name":"長鋐螺絲五金有限公司"},{"code":"1467","name":"慧燈企業社"},{"code":"1468","name":"一合電器維修站"},{"code":"1469","name":"魯賓遜(DIY帝而威)"},{"code":"1470","name":"動手族(DIY)"},{"code":"1471","name":"憶貿企業(股)公司"},{"code":"1473","name":"三蒂(股)公司"},{"code":"1476","name":"吉事多淋浴拉門"},{"code":"1479","name":"籃天(棉紗手套)"},{"code":"1482","name":"久統塑膠有限公司(PVC凡而)"},{"code":"1483","name":"兆裕興業有限公司"},{"code":"1484","name":"開程燈飾(三佳)"},{"code":"1485","name":"A&B約恩嗶聯合有限公司(掀蓋器)"},{"code":"1486","name":"百利世貿易有限公司"},{"code":"1488","name":"佳昇電線電纜有限公司"},{"code":"1493","name":"普照股份有限公司"},{"code":"1498","name":"衛純純水機"},{"code":"1505","name":"大洋電子材料行"},{"code":"1506","name":"昶碩有限公司"},{"code":"1507","name":"方琳"},{"code":"1531","name":"巨將有限公司(涮涮樂)"},{"code":"1538","name":"恆威實業股份有限公司"},{"code":"1540","name":"雷龍工程有限公司(小龍捲風)"},{"code":"1542","name":"澳華燈飾"},{"code":"1549","name":"萬能架"},{"code":"1559","name":"利嘉行(家庭五金)"},{"code":"1560","name":"光源電子企業社"},{"code":"1600","name":"全國電子(中正店)"},{"code":"1603","name":"凱旺欣業(股)有限公司"},{"code":"1617","name":"速可答科技有限公司"},{"code":"1763","name":"青縿企業有限公司-(金興順)"},{"code":"1764","name":"舍樂力企業有限公司"},{"code":"1765","name":"輝力牌瓦斯器具"},{"code":"1767","name":"得益電訊精密科技股份有限公司"},{"code":"1769","name":"欣瀚企業股份有限公司"},{"code":"1770","name":"龍翔水電材料行"},{"code":"1773","name":"陸泰工業有限公司090169243"},{"code":"2500","name":"大展電腦"},{"code":"3000","name":"玖品五金行"},{"code":"3001","name":"旭振企業有限公司"},{"code":"3002","name":"辰鶯陶磁股份有限公司"},{"code":"1561","name":"聯流科技有限公司"},{"code":"3003","name":"衛迅科技有限公司"},{"code":"3004","name":"隴緯五金貿易有限公司"},{"code":"3005","name":"日日商業股份有限公司"},{"code":"3006","name":"豪日電器材料有限公司"},{"code":"3007","name":"太沅企業行(大鋼牙)"},{"code":"3008","name":"唯力電業有限公司"},{"code":"3009","name":"路斯特企業有限公司"},{"code":"3010","name":"廣舍衛浴器材有限公司"},{"code":"3011","name":"雙發水電材料總倉"},{"code":"3012","name":"上吉衛浴設備有限公司"},{"code":"3013","name":"芳林照明有限公司"},{"code":"3014","name":"今祥實業有限公司"},{"code":"3015","name":"名人水族器材有限公司"},{"code":"3016","name":"裕華企業有限公司"},{"code":"3017","name":"今盛高壓管有限公司"},{"code":"3018","name":"赫霖企業有限公司"},{"code":"3019","name":"怡昌五金工廠"},{"code":"3020","name":"百彩科技發展股份有限公司"},{"code":"3021","name":"山力實業社"},{"code":"3022","name":"國豪企業社"},{"code":"3023","name":"九如馬達(經濟實業股份有限公司)"},{"code":"3024","name":"櫻花衛浴-至超企業有限公司"},{"code":"3025","name":"合洋實業有限公司(手按排拉桿組)"},{"code":"3026","name":"金馬照明股份有限公司0937907672"},{"code":"3027","name":"笙財企業-刷刷樂製造"},{"code":"3028","name":"酈爾電子有限公司"},{"code":"3029","name":"宏成電子材料行"},{"code":"3030","name":"謙聖集電股份有限公司"},{"code":"3031","name":"基安工業股份有限公司"},{"code":"3032","name":"名品衛材有限公司"},{"code":"3033","name":"科利企業"},{"code":"3034","name":"八德貿易有限公司"},{"code":"3035","name":"頂洋-文仁廚具有限公司"},{"code":"3036","name":"台灣康勵企業有限公司(康龍)"},{"code":"3037","name":"綠得飲水機行"},{"code":"3038","name":"翔崴水電百貨批發商行"},{"code":"3039","name":"劉享瑄"},{"code":"3040","name":"友隆企業社"},{"code":"3041","name":"上典牌不銹鋼開關箱製造廠"},{"code":"3042","name":"盧記免電"},{"code":"3043","name":"良興行"},{"code":"3044","name":"歐華企業有限公司"},{"code":"3045","name":"龍豪照明"},{"code":"3046","name":"櫻花-櫻翔企業股份有限公司"},{"code":"3047","name":"裕發精機有限公司(和川馬達)"},{"code":"3048","name":"宏祈實業有限公司   2115095凱圓"},{"code":"3049","name":"銘弘貿易有限公司"},{"code":"3050","name":"漢金國際有限公司"},{"code":"3051","name":"頡仕企業有限公司84"},{"code":"3052","name":"正晴百貨股份有限公司"},{"code":"3053","name":"映大企業股份有限公司"},{"code":"3054","name":"俊騰實業有限公司"},{"code":"3055","name":"格來億企業有限公司"},{"code":"3056","name":"祐晨不銹鋼有限公司"},{"code":"3057","name":"隆晟興業有限公司"},{"code":"3058","name":"力中電子股份有限公司"},{"code":"3059","name":"向弘國際有限公司"},{"code":"3060","name":"嘉穩企業股份有限公司"},{"code":"3061","name":"創意通生活館股份有限公司"},{"code":"3062","name":"巧巧實業股份有限公司"},{"code":"3063","name":"奇威企業有限公司"},{"code":"3064","name":"欣格衛浴企業社"},{"code":"3065","name":"進鑫塑膠股份有限公司"},{"code":"3066","name":"晉聯實業有限公司"},{"code":"3067","name":"昀宸事業有限公司"},{"code":"3068","name":"千慶國際股份有限公司"},{"code":"3069","name":"力多浴缸"},{"code":"3070","name":"福貿科技有限公司"},{"code":"3071","name":"巧展實業股份有限公司"},{"code":"3072","name":"國竺企業有限公司"},{"code":"3073","name":"欣城(松冠)冷凍冷氣材料有限公司"},{"code":"3074","name":"明新五金百貨行"},{"code":"3075","name":"慶憶貿易有限公司"},{"code":"3076","name":"新進興五金行"},{"code":"3077","name":"艾德森國際實業有限公司"},{"code":"3078","name":"遠森企業社"},{"code":"3079","name":"晶影電子有限公司"},{"code":"3080","name":"遠鋒工業股份有限公司"},{"code":"3081","name":"富士實業社(富山)"},{"code":"3082","name":"理想人生(五倚企業有限公司)"},{"code":"3083","name":"台灣嘉瑋企業有限公司"},{"code":"3084","name":"金冠霖科技有限公司"},{"code":"3085","name":"中都商行"},{"code":"3086","name":"統元實業有限公司"},{"code":"3087","name":"統一衛浴有限公司"},{"code":"3088","name":"展耀股份有限公司"},{"code":"3089","name":"準達企業有限公司"},{"code":"3090","name":"嘉得衛材行(永好衛浴)"},{"code":"3091","name":"立多浴缸"},{"code":"3092","name":"華財企業股份有限公司"},{"code":"3093","name":"金利明實業有限公司"},{"code":"3094","name":"臣采企業有限公司"},{"code":"3095","name":"譹銓企業有限公司(升壓器)"},{"code":"3096","name":"久展(峻昌)衛浴有限公司"},{"code":"3097","name":"弘昌五金行"},{"code":"3099","name":"8X8X8X"},{"code":"3100","name":"立徠有限公司"},{"code":"3101","name":"雅盛國際科技有限公司"},{"code":"3102","name":"喬巧企業有限公司"},{"code":"3103","name":"璟苙國際有限公司"},{"code":"3104","name":"弘呈電機有限公司"},{"code":"3105","name":"高樂吉企業股份有限公司"},{"code":"3106","name":"全銳發實業有限公司"},{"code":"3107","name":"永富五金銅器工廠"},{"code":"3108","name":"佳樂有限公司"},{"code":"3109","name":"永晶企業有限公司"},{"code":"3111","name":"雙泉企業社"},{"code":"3112","name":"長興運有限公司"},{"code":"3113","name":"年益電料行(合洋)"},{"code":"3114","name":"名肯膠業有限公司"},{"code":"3115","name":"台灣林內工業股份有限公司"},{"code":"3116","name":"西德瓦斯器具企業公司"},{"code":"3117","name":"建輝五金行"},{"code":"3118","name":"博威"},{"code":"3119","name":"電光企業股份有限公司"},{"code":"3120","name":"博世(德商美最時貿易股公司台灣"},{"code":"3121","name":"振慶企業有限公司"},{"code":"3122","name":"信冠實業股份有限公司"},{"code":"3123","name":"連騰企業股份有限公司-寄賣"},{"code":"3124","name":"大千淨水設備公司"},{"code":"3125","name":"李紹雍"},{"code":"3126","name":"中一電工(光奕企業有限公司)"},{"code":"3127","name":"亞泊照明股份有限公司"},{"code":"3128","name":"品亮衛浴有限公司"},{"code":"3129","name":"金泰企業行"},{"code":"3130","name":"泰昌廚具有限公司"},{"code":"3131","name":"凱越國際有限公司"},{"code":"3132","name":"祿冠企業有限公司"},{"code":"3133","name":"展炘股份有限公司"},{"code":"3134","name":"倍好有限公司"},{"code":"3135","name":"將財企業股份有限公司"},{"code":"3136","name":"豪士多股份有限公司"},{"code":"3137","name":"鴻揚電機有限公司"},{"code":"3138","name":"鋐洲有限公司(鋐霖)"},{"code":"3139","name":"全盈水電五金材料行"},{"code":"3140","name":"聯南鋼鐵公司"},{"code":"3141","name":"旺力配管有限公司"},{"code":"3142","name":"(櫻花)真鑫實業有限公司"},{"code":"3143","name":"立嘉行"},{"code":"3144","name":"富瑞喜企業有限公司"},{"code":"3145","name":"佑承企業有限公司"},{"code":"3146","name":"昇虹國際有限公司"},{"code":"3147","name":"華郁企業社(鑽石通管器)"},{"code":"3148","name":"凱信衛材有限公司"},{"code":"3149","name":"寶堂塑膠工業(股)公司"},{"code":"3150","name":"睿傑企業有限公司"},{"code":"3151","name":"弘欣照明有限公司"},{"code":"3152","name":"至祥磁器有限公司"},{"code":"3154","name":"永昇不銹鋼有限公司"},{"code":"3155","name":"駿閎有限公司(鍍鋅線槽)"},{"code":"3156","name":"歐億實業有限公司"},{"code":"3157","name":"彰隆商行"},{"code":"3158","name":"名將企業社"},{"code":"3159","name":"北晟霖塑膠股份有限公司22677997"},{"code":"3160","name":"新光企業社(葛蘭富)"},{"code":"3161","name":"豪山國際股份有限公司"},{"code":"3162","name":"俊宏號40"},{"code":"3163","name":"大利國際電機有限公司"},{"code":"3164","name":"佳福企業社"},{"code":"3165","name":"寶島(富洲企業有限公司)"},{"code":"3166","name":"匯光牌(東菖企業股份有限公司)"},{"code":"3167","name":"台灣德利五金有限公司"},{"code":"3168","name":"金永成公司"},{"code":"3169","name":"百富科技有限公司"},{"code":"3170","name":"華睿資材企業有限公司"},{"code":"3171","name":"林旺呈"},{"code":"3172","name":"京典衛浴有限公司"},{"code":"3173","name":"瑩寶實業有限公司"},{"code":"3174","name":"聯信古典浴缸"},{"code":"3175","name":"兆德科技有限公司"},{"code":"3176","name":"聚奕工業有限公司"},{"code":"3177","name":"龍慶瓦斯器具企業公司"},{"code":"3178","name":"盛隆五金行"},{"code":"3179","name":"好美(錦煌)模特兒展示架店"},{"code":"3180","name":"瑞大進衛浴器材有限公司"},{"code":"3181","name":"尚品廚具行(理想牌)"},{"code":"3182","name":"品新企業社"},{"code":"3183","name":"瑞奇"},{"code":"3184","name":"陞達實業股份有限公司"},{"code":"3185","name":"聚鑫五金有限公司"},{"code":"3186","name":"康寶結構化佈線系統有限公司"},{"code":"3187","name":"太星電業有線公司"},{"code":"3188","name":"千毓實業有限公司"},{"code":"3189","name":"源元塑膠有限公司"},{"code":"3190","name":"小施"},{"code":"3191","name":"泓海電工有限公司"},{"code":"3192","name":"統城科技股份有限公司"},{"code":"3193","name":"豐鑫企業有限公司"},{"code":"3194","name":"易立捷股份有限公司(三合鎰)"},{"code":"3195","name":"力業(股)公司"},{"code":"3197","name":"長呈實業有限公司"},{"code":"3198","name":"大登塑膠實業有限公司"},{"code":"3199","name":"悅昇貿易有限公司"},{"code":"3200","name":"戶聯資訊股份有限公司"},{"code":"3201","name":"國泰(永瓚實業有限公司)"},{"code":"3202","name":"福大行"},{"code":"3203","name":"勝順五金行"},{"code":"3204","name":"濃琪實業有限公司"},{"code":"3205","name":"耐嘉股份有限公司41"},{"code":"3206","name":"大地國際有限公司"},{"code":"3207","name":"台發水材"},{"code":"3208","name":"台騰興業有限公司(輕鋼架)"},{"code":"3209","name":"黃記商行"},{"code":"3210","name":"名揚化工原料有限公司"},{"code":"3211","name":"東元服務站"},{"code":"3212","name":"芳財醫療百貨量販"},{"code":"3213","name":"逢生國際有限公司"},{"code":"3214","name":"天得科技股份有限公司"},{"code":"3215","name":"龍師父化工有限公司"},{"code":"3216","name":"松裕百貨"},{"code":"3217","name":"廣佑科技股份有限公司"},{"code":"3218","name":"怡心國際股份有限公司"},{"code":"3219","name":"黃榮燦"},{"code":"3220","name":"鼎峰行"},{"code":"3223","name":"百世達國際實業有限公司"},{"code":"3222","name":"源鑫百貨綜合有限公司"},{"code":"3221","name":"承倉有限公司"},{"code":"3224","name":"元豐五金商行"},{"code":"3225","name":"欣翰貿易(股)公司"},{"code":"3226","name":"民生矽業有限公司"},{"code":"3227","name":"允晟照明股份有限公司"},{"code":"3228","name":"七星"},{"code":"3229","name":"金剛五金有限公司"},{"code":"3230","name":"中華大雄(股)公司-台灣哈理"},{"code":"3231","name":"聖岡科技有限公司"},{"code":"3232","name":"源鑫批發倉廚公司"},{"code":"3233","name":"大雄通訊"},{"code":"3234","name":"余升電機實業有限公司"},{"code":"3235","name":"彥宏電料行"},{"code":"3236","name":"源元塑膠有限公司"},{"code":"3237","name":"禾米科技有限公司"},{"code":"3238","name":"騰茂企業社"},{"code":"3239","name":"榮興.協宏國際企業有限公司-和成"},{"code":"3240","name":"北一鋁業有限公司"},{"code":"3241","name":"昌泓電熱材料企業有限公司"},{"code":"3245","name":"金台北家居用品百貨"},{"code":"3246","name":"純暉企業有限公司"},{"code":"3247","name":"加賀企業社"},{"code":"3248","name":"元乙冷凍材料有限公司"},{"code":"3249","name":"蓁紘商行"},{"code":"3250","name":"順山-凱韋電機廠(股)公司"},{"code":"3251","name":"僑聲事業有限公司"},{"code":"3252","name":"廣源鑫實業有限公司"},{"code":"3253","name":"珈慶企業有限公司"},{"code":"3254","name":"佐宸企業有限公司"},{"code":"3255","name":"三左興業股份有限公司"},{"code":"3256","name":"杏笙有限公司"},{"code":"3257","name":"照陽包裝材料有限公司"},{"code":"3258","name":"百潔實業有限公司"},{"code":"3259","name":"博開塑膠股份有限公司"},{"code":"3260","name":"永城汽車材料行限公司"},{"code":"3261","name":"富順泰五金有限公司"},{"code":"3262","name":"明泉五金行"},{"code":"3263","name":"志成股份有限公司桃園所"},{"code":"3264","name":"五和鑫國際有限公司"},{"code":"3265","name":"光暉水電材料行"},{"code":"3266","name":"大發白黑板公司"},{"code":"3277","name":"山緯淋浴拉門-換然一新"},{"code":"3278","name":"弘璟衛浴精品有限公司"},{"code":"3279","name":"景威鐵櫃"},{"code":"3280","name":"珈嘉鐵櫃"},{"code":"3281","name":"燊輝實業有線公司"},{"code":"3282","name":"東港橡膠企業社"},{"code":"3283","name":"莊和企業有限公司"},{"code":"3284","name":"孜展企業有限公司(佳斯捷系列)"},{"code":"3285","name":"永日昇皮件廠"},{"code":"3286","name":"崑業POS"},{"code":"3287","name":"羅馬衛浴有限公司"},{"code":"3288","name":"紳騏企業有限公司"},{"code":"3289","name":"捷仁企業有限公司"},{"code":"3290","name":"川石有限公司(壯格)"},{"code":"3291","name":"勵霖企業有限公司"},{"code":"3292","name":"松有企業有限公司"},{"code":"3293","name":"國鷹企業有限公司"},{"code":"3294","name":"晴友太陽能(股)公司"},{"code":"3295","name":"宏泵實業有限公司(全宏興業)"},{"code":"3296","name":"鉅霖日用品百貨企業有限公司"},{"code":"3297","name":"台灣精鑽人造霧企業有限公司"},{"code":"3298","name":"正言權業不銹鋼有限公司"},{"code":"3299","name":"漢洋實業有限公司(照富)"},{"code":"3300","name":"騰茂企業社"},{"code":"3301","name":"青崴企業社"},{"code":"3302","name":"亨懋國際有限公司"},{"code":"3303","name":"統一書局"},{"code":"3304","name":"吉航電器股份有限公司(達可)"},{"code":"3305","name":"弘億家庭五金"},{"code":"3306","name":"台灣晶鑽人造霧企業有限公司"},{"code":"3307","name":"台州企業股份有限公司"},{"code":"3308","name":"聯盟文具行"},{"code":"3309","name":"東大包裝企業"},{"code":"3310","name":"宥騰興業有限公司"},{"code":"3311","name":"立裕衛裕"},{"code":"3312","name":"欣中電機有限公司"},{"code":"3313","name":"萬豐家庭用品五金"},{"code":"3314","name":"二手辦公家具"},{"code":"3315","name":"善智汽車精品百貨"},{"code":"3316","name":"金禾批發行"},{"code":"3317","name":"千蓬股份有限公司"},{"code":"3318","name":"首都玻璃科技有限公司"},{"code":"3319","name":"光源照明有限公司"},{"code":"3320","name":"國寶窯業股份有限公司"},{"code":"3321","name":"台灣防潮科技"},{"code":"3322","name":"台灣新照明股份有限公司"},{"code":"3323","name":"國鷹企業有限公司"},{"code":"3324","name":"崑業事務機器有限公司"},{"code":"3325","name":"溢航五金有限公司"},{"code":"3326","name":"德沃國際有限公司"},{"code":"3327","name":"精品銅器(股)公司"},{"code":"3328","name":"貽懋有限公司"},{"code":"3329","name":"安展貿易股份有限公司"},{"code":"3330","name":"太綸電線電纜有限公司"},{"code":"3331","name":"漢特威有限公司"},{"code":"3332","name":"秦佑企業有限公司"},{"code":"3333","name":"禾鋼國際開發有限公司"},{"code":"3334","name":"峰育國際"},{"code":"3335","name":"上順包裝"},{"code":"3336","name":"明星油漆"},{"code":"3337","name":"新龍建材行"},{"code":"3338","name":"中華節能科技有限公司"},{"code":"3339","name":"十大通訊配件批發"},{"code":"3340","name":"新彩照明有限公司"},{"code":"3341","name":"言笙有限公司"},{"code":"3342","name":"全鑫欣業有限公司"},{"code":"3343","name":"尚新衛浴實業有限公司"},{"code":"3344","name":"日立電能源有限公司"},{"code":"3345","name":"宏易節能科技有限公司"},{"code":"3346","name":"湯呈有限公司"},{"code":"3347","name":"達冠科技(股)公司"},{"code":"3348","name":"陽鈞國際企業有限公司"},{"code":"3349","name":"樺諭貿易有限公司"},{"code":"3350","name":"陳政維"},{"code":"3351","name":"歐奇照明(股)公司"},{"code":"3352","name":"榮駿衛浴器材有限公司"},{"code":"3353","name":"傑銳五金有限公司"},{"code":"3354","name":"宮前實業有限公司(友音)"},{"code":"3355","name":"益聖實業公司"},{"code":"3356","name":"亞帝歐光電(股)公司"},{"code":"3357","name":"鴻基科技有限公司"},{"code":"3358","name":"永聲工業社"},{"code":"3359","name":"連騰企業股份有限公司-月現"},{"code":"3360","name":"環拓國際有限公司"},{"code":"3361","name":"喜特麗國際(股)公司"},{"code":"3362","name":"貫鈞光電科技企業有限公司"},{"code":"3363","name":"弘宸汽車專業保修廠"},{"code":"3364","name":"上達鈊科技有限公司(頂洋)"},{"code":"3365","name":"捷伯瑞照明有限公司"},{"code":"3366","name":"專城照明"},{"code":"3367","name":"仁和五金"},{"code":"3368","name":"麗源光電(股)公司"},{"code":"3369","name":"大友國際光電(股)公司"},{"code":"3370","name":"雅士達企業有限公司"},{"code":"3380","name":"美崧不銹鋼廚具"},{"code":"3381","name":"鋒寶光電科技股份有限公司"},{"code":"3382","name":"新飛翔貿易有限公司"},{"code":"3383","name":"皓奇有限公司"},{"code":"3384","name":"鼎富隆精密機械(股)公司"},{"code":"3385","name":"立裕衛裕"},{"code":"3386","name":"凌培軍"},{"code":"3387","name":"台揚建材"},{"code":"3388","name":"博振衛浴有限公司"},{"code":"3389","name":"林雅文-學生用品-磁鐵"},{"code":"3390","name":"展揚科技企業有限公司"},{"code":"3391","name":"森集工業社-工程帽工廠"},{"code":"3392","name":"高翔國際有限公司-山羊牌"},{"code":"3394","name":"蔡龍生-泓海業務"},{"code":"3395","name":"碩嘉企業有限公司"},{"code":"3399","name":"蝦皮滔寶進貨"},{"code":"4000","name":"微星客服"},{"code":"4001","name":"振華電源供應器客服"},{"code":"1774","name":"晨鈺企業有限公司04-25678316"},{"code":"2501","name":"羅馬胡家銘"},{"code":"4002","name":"專成照明有限公司-天眼"},{"code":"0291","name":"全聚多"},{"code":"4003","name":"兆微科技有限公司-索雷特"},{"code":"4004","name":"葑華實業有限公司"},{"code":"4005","name":"鼎興開發貿易(股)公司-凱樂衛浴"},{"code":"4006","name":"民峰實業明(股)公司-水泥砂"},{"code":"4007","name":"凌科淨水(凌科企業有限公司)"},{"code":"4008","name":"鑫茂企業有限公司"},{"code":"4009","name":"永偉企業有限公司"},{"code":"4010","name":"愛科濾淨實業(股)公司"},{"code":"4011","name":"永全銅器企業有限公司"},{"code":"9999","name":"欣酒洋行-上峰"},{"code":"4012","name":"弘興廚具館"},{"code":"4013","name":"歐葳室企業有限公司"},{"code":"4014","name":"悅昇貿易有限公司"},{"code":"4015","name":"冠泰電線電纜有限公司"}];
const defaults={vendors:structuredClone(MASTER_VENDORS),banks:['彰化銀行','板信銀行'],methods:['現金','支票','郵寄支票','轉帳','匯款'],checks:{'彰化銀行':[],'板信銀行':[]},payments:[]};
let db=load(),settings=loadSettings(),draft={},invoicePhotos=[],checkPhoto='',signatureData='',drawing=false,lastPoint=null,history=['home'],lastId='',currentDetailId='',isSaving=false,hasSignature=false;
let mailBatchSession={ids:[],stickerNumber:'',mailDate:'',expectedCount:0};
function load(){try{const n=JSON.parse(localStorage.getItem(KEY)||'null');if(n)return migrate(n)}catch{}return structuredClone(defaults)}
function migrate(n){n={...structuredClone(defaults),...n};if(n.vendors?.length&&typeof n.vendors[0]==='string')n.vendors=n.vendors.map((name,i)=>({code:String(3000+i),name}));const existing=Array.isArray(n.vendors)?n.vendors:[];const vendorMap=new Map(MASTER_VENDORS.map(v=>[String(v.code),{...v}]));existing.forEach(v=>{if(v&&v.code&&v.name)vendorMap.set(String(v.code),{code:String(v.code),name:String(v.name)})});n.vendors=[...vendorMap.values()].sort((a,b)=>String(a.code).localeCompare(String(b.code),'zh-Hant',{numeric:true}));n.methods=[...new Set(['現金','支票','郵寄支票','轉帳','匯款',...(n.methods||[])])];Object.keys(n.checks||{}).forEach(bank=>{n.checks[bank]=(n.checks[bank]||[]).map(x=>({...x,number:formatCheckNo(x.number)}))});(n.payments||[]).forEach(p=>{if(['支票','郵寄支票'].includes(p.method))p.checkNumber=formatCheckNo(p.checkNumber)});return n}
function loadSettings(){const base={autoBackup:true,systemName:'雙發付款管理系統',homeLabels:{payment:'新增付款',settlement:'查詢付款資料',reminder:'支票管理',report:'報表中心'}};try{const x=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');return {...base,...x,homeLabels:{...base.homeLabels,...(x.homeLabels||{})}}}catch{return base}}
function save(){
  const payload=JSON.stringify(db);
  try{
    localStorage.setItem(KEY,payload);
    // 寫入後立刻讀回驗證，避免 Safari 看似成功但實際未保存完整資料。
    const verified=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!verified||!Array.isArray(verified.payments)||verified.payments.length!==db.payments.length){
      throw new Error('付款資料驗證失敗，請重新儲存');
    }
  }catch(err){
    if(err?.name==='QuotaExceededError'||err?.code===22)throw Object.assign(new Error('STORAGE_QUOTA'),{code:'STORAGE_QUOTA'});
    throw err;
  }
  // 只保留兩份精簡快照，避免照片與簽名反覆複製造成 Safari 儲存空間爆滿。
  try{
    const a=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]');
    const slim=structuredClone(db);
    slim.payments=(slim.payments||[]).map(x=>({...x,invoicePhotos:[],checkPhoto:'',signatureData:''}));
    a.unshift({at:new Date().toISOString(),data:slim});
    localStorage.setItem(BACKUP_KEY,JSON.stringify(a.slice(0,2)));
  }catch{}
  return true;
}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function getSystemName(){return String(settings.systemName||'雙發付款管理系統').trim()||'雙發付款管理系統'}
function applySystemName(){const name=getSystemName();const h=$('#systemNameHeader');if(h)h.textContent=name;document.title=`${name} V8.3 DEV Build 017・簡潔登入正式測試版`;const loginTitle=document.querySelector('#loginSystemName');if(loginTitle)loginTitle.textContent=name;const apple=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(apple)apple.setAttribute('content',name.slice(0,12))}
function applyHomeLabels(){const d={payment:'新增付款',settlement:'查詢付款資料',reminder:'支票管理',report:'報表中心'},x={...d,...(settings.homeLabels||{})};$$('[data-home-label]').forEach(el=>el.textContent=x[el.dataset.homeLabel]||d[el.dataset.homeLabel]);const hero=$('#homeHeroTitle');if(hero)hero.textContent=[x.payment,x.settlement,x.reminder,x.report].join('、')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function formatCheckNo(v){const raw=String(v||'').trim().toUpperCase().replace(/[－–—]/g,'-').replace(/\s+/g,'');const m=raw.match(/^([A-Z]+)-?(\d+)$/);return m?`${m[1]}-${m[2]}`:raw}
function money(n){return Number(n||0).toLocaleString('zh-TW')}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function speak(text){try{if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-TW';u.rate=.92;u.volume=1;window.speechSynthesis.speak(u)}catch(e){console.warn('語音提醒失敗',e)}}
function dataBytes(v){return new Blob([String(v||'')]).size}
function dbSizeBytes(){try{return dataBytes(JSON.stringify(db))}catch{return 0}}
function fmtSize(n){if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB'}
function imageToCompressed(data,max=480,quality=.34){return new Promise(resolve=>{if(!data||!String(data).startsWith('data:image'))return resolve(data||'');const im=new Image();im.onload=()=>{try{const scale=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*scale));cv.height=Math.max(1,Math.round(im.height*scale));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);resolve(cv.toDataURL('image/jpeg',quality))}catch{resolve(data)}};im.onerror=()=>resolve(data);im.src=data})}
async function optimizeStoredPhotos(){let changed=0;for(const p of db.payments||[]){const old=[...(p.invoicePhotos||[])];const newer=[];for(const x of old){const y=await imageToCompressed(x,480,.32);if(y&&y.length<x.length)changed++;newer.push(y)}p.invoicePhotos=newer;if(p.checkPhoto){const y=await imageToCompressed(p.checkPhoto,520,.34);if(y.length<p.checkPhoto.length)changed++;p.checkPhoto=y}if(p.signatureData){const y=await imageToCompressed(p.signatureData,520,.45);if(y.length<p.signatureData.length)changed++;p.signatureData=y}}return changed}
async function saveWithStorageRecovery(currentId){try{return save()}catch(err){if(err?.code!=='STORAGE_QUOTA'&&err?.message!=='STORAGE_QUOTA')throw err;toast('儲存空間不足，正在壓縮照片…');speak('手機儲存空間不足，系統正在壓縮照片，照片不會刪除。');try{downloadBackup(false)}catch{}const changed=await optimizeStoredPhotos();try{const ok=save();renderStorageStatus();if(changed){toast(`已壓縮 ${changed} 份照片，所有照片均保留`);speak('照片壓縮完成，所有照片均已保留。')}return ok}catch(err2){if(err2?.code!=='STORAGE_QUOTA'&&err2?.message!=='STORAGE_QUOTA')throw err2;alert('手機瀏覽器的儲存空間已滿。系統不會刪除任何照片，因此這筆資料尚未存入。\n\n請先按「立即完整備份」，再清理其他手機檔案，或改用容量較大的裝置後匯入備份。');speak('儲存空間仍然不足。系統沒有刪除任何照片，請先完整備份。');throw new Error('手機儲存空間不足；為保留全部照片，系統已停止存檔。')}}}
async function compressAllPhotosSafely(){if(!confirm('系統只會壓縮照片容量，不會刪除任何請款單、支票照片或簽名。確定開始？'))return;const before=dbSizeBytes();const changed=await optimizeStoredPhotos();try{save();const after=dbSizeBytes();renderStorageStatus();const saved=Math.max(0,before-after);toast(`已壓縮 ${changed} 份照片，沒有刪除資料`);speak('照片壓縮完成，所有照片均已保留。');alert(`壓縮完成。\n處理照片：${changed} 份\n節省空間：約 ${fmtSize(saved)}\n所有照片與簽名均完整保留。`)}catch(e){alert('壓縮後仍超過手機瀏覽器容量，但系統沒有刪除任何照片。請先匯出完整備份，再改用容量較大的裝置。')}}
function renderStorageStatus(){const el=$('#storageStatus');if(!el)return;const bytes=dbSizeBytes();let photos=0;(db.payments||[]).forEach(p=>photos+=(p.invoicePhotos||[]).length+(p.checkPhoto?1:0)+(p.signatureData?1:0));el.innerHTML=`目前資料量：<b>${fmtSize(bytes)}</b><br>手機內照片與簽名：<b>${photos} 份</b><br><small>所有照片永久保留。空間不足時只會壓縮，不會自動刪除。</small>`}
const titles={home:'首頁',vendor:'新增付款',payment:'付款資料',method:'付款方式',bank:'選擇銀行',check:'支票／轉帳資料',photos:'拍照存證',signature:'廠商簽名',confirm:'確認資料',done:'完成',search:'查詢付款',detail:'付款明細',checks:'支票管理',report:'報表中心',vendors:'廠商基本資料',settings:'系統設定',todayMail:'本日郵寄清單'};
function show(id,push=true){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$('#pageTitle').textContent=titles[id]||'';$('#backBtn').classList.toggle('hidden',id==='home');$('#homeBtn').classList.toggle('hidden',id==='home');if(push&&history.at(-1)!==id)history.push(id);scrollTo(0,0);if(id==='signature')setTimeout(sizeCanvas,80);if(id==='search')runSearch();if(id==='checks')renderChecks();if(id==='report')renderReportControls();if(id==='settings')renderSettings();if(id==='vendors')renderVendorManager();if(id==='vendor')renderLists()}
$('#backBtn').onclick=()=>{history.pop();show(history.at(-1)||'home',false)};$('#homeBtn').onclick=()=>{history=['home'];show('home',false)};$$('[data-go]').forEach(b=>b.onclick=()=>{const id=b.dataset.go;if(id==='vendor')start();show(id)});
function vendorLabel(v){return `${v.code}－${v.name}`}
function findVendor(code){return db.vendors.find(v=>String(v.code)===String(code))}
function renderLists(){const el=$('#vendorOptions');if(el)el.innerHTML=db.vendors.slice().sort((a,b)=>String(a.code).localeCompare(String(b.code),'zh-Hant',{numeric:true})).map(v=>`<option value="${esc(vendorLabel(v))}"></option>`).join('')}
function resolveVendorInput(raw){const q=String(raw||'').trim();if(!q)return null;const normalized=q.replace(/[－–—-]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();let v=db.vendors.find(v=>vendorLabel(v).toLowerCase()===q.toLowerCase()||String(v.code).toLowerCase()===q.toLowerCase()||String(v.name).toLowerCase()===q.toLowerCase());if(v)return v;const matches=db.vendors.filter(v=>`${v.code} ${v.name}`.toLowerCase().includes(normalized));return matches.length===1?matches[0]:null}
function start(){draft={clientSaveToken:(crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`)};invoicePhotos=[];checkPhoto='';signatureData='';hasSignature=false;isSaving=false;const saveBtn=$('#saveBtn');if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='確認存檔'}$('#vendorInput').value='';if($('#manualCheckNumber'))$('#manualCheckNumber').value='';$('#payMonth').value=new Date().toISOString().slice(0,7);$('#amountDue').value='';$('#rate').value='95';$('#roundMode').value='ones';$('#amountPaid').value='';$('#deductionAmount').value='0';$('#deductionNote').value='';renderPhotos();updateCalculation()}
$('#vendorNext').onclick=()=>{const raw=$('#vendorInput').value;const v=resolveVendorInput(raw);if(!v)return toast('找不到唯一廠商，請輸入完整代號、名稱，或從建議清單點選');$('#vendorInput').value=vendorLabel(v);draft.vendorCode=v.code;draft.vendor=v.name;show('payment')};$('#quickAddVendor').onclick=()=>show('vendors');
function calcPaid(){const due=Number($('#amountDue').value||0),rate=Number($('#rate').value||0)/100,raw=due*rate,mode=$('#roundMode').value;let val=raw;if(mode==='ones')val=Math.floor(raw/10)*10;if(mode==='tens')val=Math.floor(raw/100)*100;if(mode==='hundreds')val=Math.floor(raw/1000)*1000;if(mode==='round')val=Math.round(raw);return Math.max(0,val)}
function updateCalculation(){const v=calcPaid();$('#calculatedPaid').textContent='$'+money(v);if(!$('#amountPaid').dataset.manual)$('#amountPaid').value=v||'';$('#deductionAmount').value=Math.max(0,Number($('#amountDue').value||0)-Number($('#amountPaid').value||0))}
['amountDue','rate','roundMode'].forEach(id=>$('#'+id).addEventListener('input',()=>{$('#amountPaid').dataset.manual='';updateCalculation()}));$('#amountPaid').addEventListener('input',()=>{$('#amountPaid').dataset.manual='1';$('#deductionAmount').value=Math.max(0,Number($('#amountDue').value||0)-Number($('#amountPaid').value||0))});
$('#paymentNext').onclick=()=>{Object.assign(draft,{month:$('#payMonth').value,amountDue:$('#amountDue').value,rate:$('#rate').value,roundMode:$('#roundMode').value,calculatedPaid:calcPaid(),amountPaid:$('#amountPaid').value,deductionAmount:$('#deductionAmount').value,deductionNote:$('#deductionNote').value});if(!draft.month||!draft.amountDue||!draft.amountPaid)return toast('請填月份、應付與實付金額');renderMethods();show('method')};
function isCheckMethod(method){return ['支票','郵寄支票'].includes(method)}
function renderMethods(){$('#methodChoices').innerHTML=db.methods.map(m=>`<button class="choice" data-m="${esc(m)}">${esc(m)}</button>`).join('');$$('[data-m]').forEach(b=>b.onclick=()=>{draft.method=b.dataset.m;if([...['支票','郵寄支票'],'轉帳','匯款'].includes(draft.method)){renderBanks();show('bank')}else showPhotosPage()})}
function renderBanks(){$('#bankChoices').innerHTML=db.banks.map(b=>`<button class="choice" data-b="${esc(b)}">${esc(b)}</button>`).join('');$$('[data-b]').forEach(b=>b.onclick=()=>{draft.bank=b.dataset.b;$('#selectedBank').value=draft.bank;const isCheck=isCheckMethod(draft.method);const isMail=draft.method==='郵寄支票';$('#checkFields').classList.toggle('hidden',!isCheck);$('#transferFields').classList.toggle('hidden',isCheck);$('#mailFields')?.classList.toggle('hidden',!isMail);const a=(db.checks[draft.bank]||[]).filter(x=>x.status!=='已使用');$('#checkNumber').innerHTML='<option value="">請選擇支票號碼</option>'+a.map(x=>`<option>${esc(x.number)}</option>`).join('');$('#checkAmount').value=draft.amountPaid||'';
if(isMail&&mailBatchSession.ids.length){
  if($('#mailStickerNumber'))$('#mailStickerNumber').value=mailBatchSession.stickerNumber||'';
  if($('#mailDate'))$('#mailDate').value=mailBatchSession.mailDate||new Date().toISOString().slice(0,10);
  if($('#mailTotalCount'))$('#mailTotalCount').value=mailBatchSession.expectedCount||mailBatchSession.ids.length;
}
show('check')})}
$('#manualCheckNumber')?.addEventListener('input',e=>e.target.value=formatCheckNo(e.target.value));$('#manualCheckNumber')?.addEventListener('blur',e=>e.target.value=formatCheckNo(e.target.value));$('#checkNext').onclick=()=>{const manual=formatCheckNo($('#manualCheckNumber')?.value||'');const selected=formatCheckNo($('#checkNumber').value);const number=manual||selected;Object.assign(draft,{checkNumber:number,checkDueDate:$('#checkDueDate').value,transferDate:$('#transferDate').value,checkAmount:$('#checkAmount').value,mailTotalCount:Math.max(1,Number($('#mailTotalCount')?.value||1)),mailStickerNumber:($('#mailStickerNumber')?.value||'').trim(),mailDate:$('#mailDate')?.value||''});if(isCheckMethod(draft.method)&&(!draft.checkNumber||!draft.checkDueDate))return toast('請輸入或選擇票號，並填到期日');if(draft.method==='郵寄支票'&&(!draft.mailTotalCount||draft.mailTotalCount<1))return toast('請填寫本次郵寄共幾筆');if(draft.method==='郵寄支票'&&!draft.mailStickerNumber)return toast('請填寫郵局郵寄貼紙號碼');if(isCheckMethod(draft.method)&&manual){db.checks[draft.bank]??=[];if(!db.checks[draft.bank].some(x=>x.number===manual))db.checks[draft.bank].push({number:manual,status:'未使用'})}if(!isCheckMethod(draft.method)&&!draft.transferDate)return toast('請填預定轉帳日');showPhotosPage()};
function showPhotosPage(){$('#checkPhotoBlock').classList.toggle('hidden',!isCheckMethod(draft.method));show('photos')}
function fileData(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const max=520,scale=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*scale));cv.height=Math.max(1,Math.round(im.height*scale));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL('image/jpeg',.34))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}
$('#invoicePhoto').onchange=async e=>{for(const f of e.target.files)invoicePhotos.push(await fileData(f));renderPhotos()};$('#checkPhoto').onchange=async e=>{if(e.target.files[0])checkPhoto=await fileData(e.target.files[0]);renderPhotos()};function renderPhotos(){$('#invoicePreview').innerHTML=invoicePhotos.map(x=>`<img src="${x}">`).join('');$('#checkPreview').innerHTML=checkPhoto?`<img src="${checkPhoto}">`:''}
$('#photosNext').onclick=()=>show('signature');
const c=$('#signatureCanvas'),ctx=c.getContext('2d');
function fillSignatureWhite(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.restore()}
function exportSignatureImage(){const out=document.createElement('canvas');out.width=c.width;out.height=c.height;const o=out.getContext('2d');o.fillStyle='#fff';o.fillRect(0,0,out.width,out.height);o.drawImage(c,0,0);return out.toDataURL('image/jpeg',.58)}
function sizeCanvas(){
  const old=hasSignature?exportSignatureImage():'';
  const r=c.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
  c.width=Math.max(1,Math.round(r.width*ratio));c.height=Math.max(1,Math.round(r.height*ratio));
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111';
  fillSignatureWhite();
  if(old){const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,r.width,r.height);im.src=old}
}
function pos(e){const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function begin(e){e.preventDefault();drawing=true;hasSignature=true;lastPoint=pos(e);try{c.setPointerCapture(e.pointerId)}catch{}}
function move(e){if(!drawing)return;e.preventDefault();const q=pos(e);ctx.beginPath();ctx.moveTo(lastPoint.x,lastPoint.y);ctx.lineTo(q.x,q.y);ctx.stroke();lastPoint=q}
function end(e){if(!drawing)return;drawing=false;try{c.releasePointerCapture(e.pointerId)}catch{};signatureData=exportSignatureImage()}
c.addEventListener('pointerdown',begin,{passive:false});c.addEventListener('pointermove',move,{passive:false});c.addEventListener('pointerup',end,{passive:false});c.addEventListener('pointercancel',end,{passive:false});
$('#clearSignature').onclick=()=>{fillSignatureWhite();signatureData='';hasSignature=false};
$('#signatureNext').onclick=()=>{if(drawing)end({pointerId:-1});if(!hasSignature||!signatureData)return toast('請先完成廠商簽名');renderSummary();show('confirm')};
function voucher(p){if(p.method==='支票')return `${p.bank||''} ${formatCheckNo(p.checkNumber||'')}`.trim();return p.method||''}
function statusFor(p){if(p.method==='現金')return '已銷帳';if(p.method==='郵寄支票')return '待寄出';if(p.method==='支票')return '已開支票';return '待轉帳'}
function addToMailBatch(p){
  if(p.method!=='郵寄支票')return;
  if(mailBatchSession.stickerNumber&&mailBatchSession.stickerNumber!==p.mailStickerNumber){mailBatchSession={ids:[],stickerNumber:'',mailDate:'',expectedCount:0}}
  if(!mailBatchSession.ids.includes(p.id))mailBatchSession.ids.push(p.id);
  mailBatchSession.stickerNumber=p.mailStickerNumber||mailBatchSession.stickerNumber;
  mailBatchSession.mailDate=p.mailDate||mailBatchSession.mailDate||new Date().toISOString().slice(0,10);
  mailBatchSession.expectedCount=Math.max(Number(p.mailTotalCount||0),mailBatchSession.ids.length);
}
function printMailBatch(items,totalCount,sticker,date){
  const sum=items.reduce((a,p)=>a+Number(p.amountPaid||0),0);
  const body=items.map((p,i)=>`<tr><td>${i+1}</td><td>${esc(p.vendorCode||'')}</td><td>${esc(p.vendor||'')}</td><td>${esc(p.bank||'')}</td><td>${esc(formatCheckNo(p.checkNumber||''))}</td><td>${esc(p.checkDueDate||'')}</td><td class="num">$${money(p.amountPaid)}</td></tr>`).join('');
  const w=window.open('','_blank');
  if(!w){alert('瀏覽器阻擋列印視窗，請允許彈出式視窗後再試。');return}
  w.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>郵寄支票清單</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif;padding:24px;color:#111}h1{text-align:center;margin:0 0 18px}.info{font-size:17px;line-height:1.8;margin-bottom:14px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border:1px solid #444;padding:7px;text-align:left}.num{text-align:right}.total{margin-top:14px;font-size:18px;font-weight:700;text-align:right}.sign{margin-top:36px;display:flex;justify-content:space-between}@media print{button{display:none}body{padding:0}}</style></head><body><h1>郵寄支票寄件清單</h1><div class="info">寄件日期：${esc(date||'—')}<br>郵局郵寄貼紙號碼：${esc(sticker||'—')}<br>確認共幾筆：<b>${totalCount} 筆</b>　系統已登錄：${items.length} 筆</div><table><thead><tr><th>項次</th><th>代號</th><th>廠商</th><th>銀行</th><th>支票號碼</th><th>到期日</th><th>金額</th></tr></thead><tbody>${body}</tbody></table><div class="total">合計：$${money(sum)}</div><div class="sign"><span>整理人：________________</span><span>寄件確認：________________</span></div><p><button onclick="window.print()">列印</button></p></body></html>`);
  w.document.close();setTimeout(()=>{w.focus();w.print()},300);
}
async function finishMailBatch(){
  const items=mailBatchSession.ids.map(id=>db.payments.find(p=>p.id===id)).filter(Boolean);
  if(!items.length)return;
  const actual=items.length;
  const input=prompt(`本次郵寄支票已輸入 ${actual} 筆。\n\n請確認本次郵寄共幾筆：`,String(mailBatchSession.expectedCount||actual));
  if(input===null)return;
  const totalCount=Math.max(1,parseInt(input,10)||actual);
  items.forEach(p=>p.mailTotalCount=totalCount);
  mailBatchSession.expectedCount=totalCount;
  try{save()}catch(e){console.error(e)}
  const ok=confirm(`本次郵寄支票確認共 ${totalCount} 筆。\n郵寄貼紙號碼：${mailBatchSession.stickerNumber||'未填'}\n\n是否列印郵寄支票清單？`);
  if(ok)printMailBatch(items,totalCount,mailBatchSession.stickerNumber,mailBatchSession.mailDate);
  if(window.shuangfaSpeak)window.shuangfaSpeak(`本次郵寄支票共 ${totalCount} 筆，確認完成。`,'success');
  mailBatchSession={ids:[],stickerNumber:'',mailDate:'',expectedCount:0};
}

function rows(p){const r=[['序號',p.serial||'尚未產生'],['廠商',`${p.vendorCode||''} ${p.vendor}`],['收款月份',p.month],['應付金額','$'+money(p.amountDue)],['計算比例',(p.rate||100)+'%'],['自動計算實付','$'+money(p.calculatedPaid)],['實付金額','$'+money(p.amountPaid)],['扣款／差額','$'+money(p.deductionAmount)],['扣款內容',p.deductionNote||'—'],['付款憑證',voucher(p)],['狀態',p.status||statusFor(p)]];if(isCheckMethod(p.method))r.push(['到期日',p.checkDueDate]);if(p.method==='郵寄支票'){r.push(['本次郵寄共幾筆',(p.mailTotalCount||1)+' 筆']);r.push(['郵局郵寄貼紙號碼',p.mailStickerNumber||'—']);r.push(['寄件日期',p.mailDate||'—'])};if(['轉帳','匯款'].includes(p.method))r.push(['預定轉帳日',p.transferDate]);if(p.settledAt)r.push(['銷帳時間',new Date(p.settledAt).toLocaleString('zh-TW')]);return r}
function htmlRows(r){return r.map(([k,v])=>`<div class="row"><div class="key">${esc(k)}</div><div class="val">${esc(v)}</div></div>`).join('')}
function renderSummary(){$('#summary').innerHTML=htmlRows([...rows(draft),['請款單照片',invoicePhotos.length+' 張'],['支票照片',checkPhoto?'1 張':'0 張'],['廠商簽名','已完成']])}
function nextSerial(){const d=new Date(),z=n=>String(n).padStart(2,'0'),prefix=`FK${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}`;const nums=db.payments.filter(p=>p.serial?.startsWith(prefix)).map(p=>Number(p.serial.slice(-4))).filter(Number.isFinite);return prefix+String((nums.length?Math.max(...nums):0)+1).padStart(4,'0')}
$('#editBtn').onclick=()=>show('payment');
$('#saveBtn').onclick=async()=>{
  if(isSaving)return;
  if(!signatureData)return toast('簽名資料尚未完成，請返回重新簽名');
  if(!confirm('確定要儲存這筆付款資料嗎？'))return;
  isSaving=true;const btn=$('#saveBtn');btn.disabled=true;btn.textContent='儲存中…';
  const id=crypto.randomUUID?crypto.randomUUID():String(Date.now());
  // 先建立唯一儲存識別碼，再檢查重複，避免連按或瀏覽器重送。
  draft.clientSaveToken=draft.clientSaveToken||id;
  const duplicate=db.payments.find(x=>x.clientSaveToken===draft.clientSaveToken);
  if(duplicate){toast('這筆資料已經儲存');history=['home','search','detail'];openDetail(duplicate.id);isSaving=false;return}
  const p={id,serial:nextSerial(),...draft,clientSaveToken:draft.clientSaveToken,status:statusFor(draft),invoicePhotos:[...invoicePhotos],checkPhoto,signatureData,createdAt:new Date().toISOString()};
  db.payments.unshift(p);
  let usedCheck=null;
  if(p.method==='支票'){usedCheck=(db.checks[p.bank]||[]).find(x=>x.number===p.checkNumber);if(usedCheck)Object.assign(usedCheck,{status:'已使用',dueDate:p.checkDueDate,paymentId:id})}
  try{
    const expectedCount=db.payments.length;
    await saveWithStorageRecovery(id);
    // 重新由手機儲存區讀回，確認新增的每一筆都真的存在。
    db=migrate(JSON.parse(localStorage.getItem(KEY)||'null'));
    if(db.payments.length!==expectedCount||!db.payments.some(x=>x.id===id))throw new Error('本筆資料沒有完整寫入，請重新儲存');
    lastId=id;renderDue();
    addToMailBatch(p);
    $('#searchInput').value='';$('#statusFilter').value='';runSearch();
    // 儲存完成立即跳到本筆明細，避免使用者再次按儲存。
    history=['home','search','detail'];openDetail(id);toast('付款資料已儲存');
    if(window.shuangfaSpeak)window.shuangfaSpeak('付款資料已儲存完成。','success');
    if(p.method==='郵寄支票'){
      const repeatDefaults={month:p.month,rate:p.rate||'95',roundMode:p.roundMode||'ones'};
      setTimeout(()=>{
        const again=confirm('本筆郵寄支票已儲存完成。\n\n要再新增一筆郵寄支票嗎？\n\n按「確定」繼續新增；按「取消」確認總筆數並列印。');
        if(!again){finishMailBatch();return;}
        start();
        $('#payMonth').value=repeatDefaults.month||new Date().toISOString().slice(0,7);
        $('#rate').value=repeatDefaults.rate;
        $('#roundMode').value=repeatDefaults.roundMode;
        updateCalculation();
        history=['home','vendor'];show('vendor',false);
        toast('請輸入下一家廠商代號');
        setTimeout(()=>$('#vendorInput')?.focus(),120);
      },350);
    }
  }catch(err){
    db.payments=db.payments.filter(x=>x.id!==id);
    if(usedCheck)Object.assign(usedCheck,{status:'未使用',dueDate:'',paymentId:''});
    console.error(err);alert(err.message||'儲存失敗，請稍後再試');
    isSaving=false;btn.disabled=false;btn.textContent='確認存檔';
  }
};$('#newAgain').onclick=()=>{start();history=['home','vendor'];show('vendor',false)};$('#viewLast').onclick=()=>openDetail(lastId);
$('#searchInput').oninput=runSearch;$('#statusFilter').onchange=runSearch;function runSearch(){const q=($('#searchInput').value||'').trim().toLowerCase(),st=$('#statusFilter').value,a=db.payments.filter(p=>(!q||[p.vendor,p.vendorCode,p.serial,p.checkNumber,p.bank,p.mailStickerNumber].join(' ').toLowerCase().includes(q))&&(!st||p.status===st));const counter=$('#paymentCount');if(counter)counter.textContent=`全部 ${db.payments.length} 筆｜目前顯示 ${a.length} 筆`;$('#paymentList').innerHTML=a.length?a.map(p=>`<div class="record"><h3>${esc(p.serial)}｜${esc(p.vendorCode)} ${esc(p.vendor)}</h3><div class="meta">${esc(p.month)}｜實付 $${money(p.amountPaid)}<br>付款憑證：${esc(voucher(p))}　<span class="status-pill">${esc(p.status)}</span></div><button class="secondary full" data-detail="${p.id}">查看明細</button></div>`).join(''):'<p class="hint">尚無符合資料。</p>';$$('[data-detail]').forEach(b=>b.onclick=()=>openDetail(b.dataset.detail))}
function openDetail(id){const p=db.payments.find(x=>x.id===id);if(!p)return;currentDetailId=id;$('#detailBody').innerHTML=htmlRows([...rows(p),['建立時間',new Date(p.createdAt).toLocaleString('zh-TW')]]);$('#settleBtn').classList.toggle('hidden',p.status==='已銷帳'||p.status==='作廢');const imgs=[...(p.invoicePhotos||[]),p.checkPhoto,p.signatureData].filter(Boolean);$('#detailImages').innerHTML=imgs.map(x=>`<img src="${x}">`).join('');show('detail')}
function printDocument(title,body){
  const w=window.open('','_blank','width=900,height=900');
  if(!w)return toast('瀏覽器阻擋列印視窗，請允許彈出式視窗');
  const backUrl=location.href.split('#')[0];
  w.document.open();w.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>
  @page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;color:#111;margin:0;font-size:14px}.print-toolbar{position:sticky;top:0;z-index:99;display:flex;gap:10px;padding:10px;background:#0f4c5c}.print-toolbar button{flex:1;border:0;border-radius:10px;padding:12px 8px;font-weight:800;font-size:16px}.print-toolbar .primary{background:#fff;color:#0f4c5c}.print-toolbar .secondary{background:#dfeff2;color:#123}h1{text-align:center;font-size:22px;margin:8px 0 4px}.sub{text-align:center;color:#555;margin-bottom:12px}.info{width:100%;border-collapse:collapse;margin:8px 0 12px}.info th,.info td{border:1px solid #777;padding:6px 7px;vertical-align:top}.info th{width:24%;background:#f2f2f2;text-align:left}.photos{display:grid;grid-template-columns:1fr 1fr;gap:10px}.photos img{width:100%;max-height:220px;object-fit:contain;border:1px solid #aaa}.signature{margin-top:10px;border-top:1px solid #555;padding-top:6px}.signature img{display:block;max-width:420px;max-height:170px;object-fit:contain;background:white;border:1px solid #ddd}.foot{margin-top:12px;font-size:11px;color:#666;text-align:right}.report-table{width:100%;border-collapse:collapse;font-size:11px}.report-table th,.report-table td{border:1px solid #777;padding:5px;word-break:break-word}.report-table th{background:#eee}.summaryline{margin:8px 0 12px;font-weight:700}@media print{.print-toolbar{display:none!important}body{font-size:12px}h1{font-size:20px;margin-top:0}.signature img{max-height:150px}.photos img{max-height:200px}}
  </style></head><body><div class="print-toolbar"><button class="primary" onclick="try{window.close()}catch(e){};setTimeout(()=>{location.href='${backUrl}'},120)">返回系統</button><button class="secondary" onclick="window.print()">列印 / 另存PDF</button></div>${body}<script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);w.document.close();
}
function receiptPrintHtml(p){
  const dataRows=rows(p).filter(([k])=>!['自動計算實付'].includes(k));
  const table=`<table class="info">${dataRows.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>`;
  const invoices=(p.invoicePhotos||[]).map((x,i)=>`<div><b>請款單照片 ${i+1}</b><img src="${x}"></div>`).join('');
  const check=p.checkPhoto?`<div><b>支票照片</b><img src="${p.checkPhoto}"></div>`:'';
  const sig=p.signatureData?`<div class="signature"><b>廠商簽名</b><img src="${p.signatureData}"></div>`:'';
  return `<h1>${esc(getSystemName())}－廠商付款簽收單</h1><div class="sub">付款序號：${esc(p.serial)}</div>${table}<div class="photos">${invoices}${check}</div>${sig}<div class="foot">列印時間：${new Date().toLocaleString('zh-TW')}</div>`;
}
$('#settleBtn').onclick=()=>{const p=db.payments.find(x=>x.id===currentDetailId);if(!p)return;p.status='已銷帳';p.settledAt=new Date().toISOString();save();toast('已完成銷帳並停止提醒');openDetail(p.id);renderDue()};
$('#editPaymentBtn').onclick=()=>{const p=db.payments.find(x=>x.id===currentDetailId);if(!p)return toast('找不到付款資料');const due=prompt('應付金額',p.amountDue??'');if(due===null)return;const paid=prompt('實付金額',p.amountPaid??'');if(paid===null)return;const note=prompt('扣款內容',p.deductionNote??'');if(note===null)return;const status=prompt('狀態：待轉帳／已開支票／已銷帳／作廢',p.status??'');if(status===null)return;if(!/^\d+(\.\d+)?$/.test(String(due).trim())||!/^\d+(\.\d+)?$/.test(String(paid).trim()))return toast('金額格式不正確');p.amountDue=Number(due);p.amountPaid=Number(paid);p.deductionAmount=Math.max(0,p.amountDue-p.amountPaid);p.deductionNote=String(note).trim();if(['待轉帳','已開支票','已銷帳','作廢'].includes(String(status).trim()))p.status=String(status).trim();p.updatedAt=new Date().toISOString();save();toast('付款資料已修改');openDetail(p.id);runSearch();renderDue()};
$('#printReceiptBtn').onclick=()=>{const p=db.payments.find(x=>x.id===currentDetailId);if(!p)return toast('找不到付款資料');printDocument(getSystemName()+' 付款簽收單 '+p.serial,receiptPrintHtml(p))};
function renderChecks(){
  $('#manageBank').innerHTML=db.banks.map(b=>`<option>${esc(b)}</option>`).join('');
  $('#manageBank').onchange=renderCheckList;
  renderCheckList();
}
function checkIsReferenced(number){
  return db.payments.some(p=>formatCheckNo(p.checkNumber||'')===formatCheckNo(number||''));
}
function removeUnusedCheck(bank,number){
  const list=db.checks[bank]||[];
  const item=list.find(x=>x.number===number);
  if(!item)return toast('找不到這張支票');
  if((item.status||'未使用')!=='未使用'||checkIsReferenced(number))return toast('這張支票已使用，不能刪除');
  if(!confirm(`確定刪除測試支票 ${number}？`))return;
  db.checks[bank]=list.filter(x=>x.number!==number);
  try{save()}catch(err){return toast(err.message)}
  toast('測試支票已刪除');
  renderCheckList();
}
function clearUnusedChecksForBank(){
  const bank=$('#manageBank').value||db.banks[0];
  const list=db.checks[bank]||[];
  const removable=list.filter(x=>(x.status||'未使用')==='未使用'&&!checkIsReferenced(x.number));
  if(!removable.length)return toast('沒有可清除的未使用支票');
  if(!confirm(`確定清除「${bank}」共 ${removable.length} 張未使用支票？\n已使用及付款紀錄中的支票都會保留。`))return;
  const word=prompt('為避免誤刪，請輸入「清除」');
  if(word!=='清除')return toast('未清除支票');
  const removeSet=new Set(removable.map(x=>x.number));
  db.checks[bank]=list.filter(x=>!removeSet.has(x.number));
  try{save()}catch(err){return toast(err.message)}
  toast(`已清除 ${removable.length} 張未使用支票`);
  renderCheckList();
}
function renderCheckList(){
  const b=$('#manageBank').value||db.banks[0],a=db.checks[b]||[];
  const unused=a.filter(x=>(x.status||'未使用')==='未使用'&&!checkIsReferenced(x.number)).length;
  $('#checkList').innerHTML=`<div class="card"><h3>${esc(b)} 支票</h3><p class="hint">共 ${a.length} 張，可刪除的未使用支票 ${unused} 張。已使用支票不可刪除。</p>${unused?'<button id="clearUnusedChecks" class="secondary danger full">清除本銀行未使用的測試支票</button>':''}</div>`+(a.length?a.map(x=>{const referenced=checkIsReferenced(x.number);const canDelete=(x.status||'未使用')==='未使用'&&!referenced;return `<div class="record"><b>${esc(x.number)}</b><div class="meta">${esc(x.status||'未使用')}${x.dueDate?'｜到期 '+esc(x.dueDate):''}${referenced?'｜已有付款紀錄':''}</div>${canDelete?`<button class="secondary danger" data-delete-check="${esc(x.number)}">刪除</button>`:''}</div>`}).join(''):'<p class="hint">尚未建立支票號碼。</p>');
  $('#clearUnusedChecks')?.addEventListener('click',clearUnusedChecksForBank);
  $$('[data-delete-check]').forEach(btn=>btn.onclick=()=>removeUnusedCheck(b,btn.dataset.deleteCheck));
}
function normalizeCheckNo(v){return formatCheckNo(v)}
function validCheckNo(v){return /^(?:[A-Z]+-\d+|\d+)$/.test(v)}
$('#newCheckNo').addEventListener('input',e=>e.target.value=normalizeCheckNo(e.target.value));
$('#checkPrefix').addEventListener('input',e=>e.target.value=e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,2));
$('#addCheck').onclick=()=>{const b=$('#manageBank').value,n=normalizeCheckNo($('#newCheckNo').value);if(!validCheckNo(n))return toast('票號請輸入英文與數字，例如 AB-00000862；系統會自動加入 -');db.checks[b]??=[];if(db.checks[b].some(x=>x.number===n))return toast('票號已存在');db.checks[b].push({number:n,status:'未使用'});try{save()}catch(err){return toast(err.message)}$('#newCheckNo').value='';renderCheckList()};
$('#addRange').onclick=()=>{const b=$('#manageBank').value,prefix=$('#checkPrefix').value.trim().toUpperCase(),a=$('#rangeStart').value.trim(),z=$('#rangeEnd').value.trim();if(!/^[A-Z]{2}$/.test(prefix))return toast('請輸入兩位英文字母，例如 AB');if(!/^\d+$/.test(a)||!/^\d+$/.test(z))return toast('起始與結束號碼請輸入純數字');const startNo=+a,endNo=+z;if(endNo<startNo||endNo-startNo>500)return toast('範圍不正確');const w=Math.max(a.length,z.length);db.checks[b]??=[];for(let n=startNo;n<=endNo;n++){const no=`${prefix}-${String(n).padStart(w,'0')}`;if(!db.checks[b].some(x=>x.number===no))db.checks[b].push({number:no,status:'未使用'})}try{save()}catch(err){return toast(err.message)}renderCheckList()};
function renderReportControls(){$('#reportVendor').innerHTML='<option value="">全部廠商</option>'+db.vendors.map(v=>`<option value="${esc(v.code)}">${esc(vendorLabel(v))}</option>`).join('');if(!$('#reportStart').value){const y=new Date().getFullYear();$('#reportStart').value=`${y}-01-01`;$('#reportEnd').value=`${y}-12-31`}buildReport()}
function reportData(){const code=$('#reportVendor').value,s=$('#reportStart').value,e=$('#reportEnd').value;return db.payments.filter(p=>(!code||p.vendorCode===code)&&(!s||p.createdAt.slice(0,10)>=s)&&(!e||p.createdAt.slice(0,10)<=e))}
function buildReport(){const a=reportData(),total=a.reduce((x,p)=>x+Number(p.amountPaid||0),0),ded=a.reduce((x,p)=>x+Number(p.deductionAmount||0),0),name=$('#reportVendor').selectedOptions[0]?.text||'全部廠商';$('#reportOutput').innerHTML=`<div class="card"><h2>${esc(getSystemName())}付款報表</h2><p>廠商：${esc(name)}<br>期間：${esc($('#reportStart').value)} ～ ${esc($('#reportEnd').value)}</p><p><b>付款筆數：${a.length} 筆　實付合計：$${money(total)}　扣款合計：$${money(ded)}</b></p><table class="report-table"><thead><tr><th>序號</th><th>日期</th><th>廠商</th><th>應付</th><th>實付</th><th>付款憑證</th><th>狀態</th></tr></thead><tbody>${a.map(p=>`<tr><td>${esc(p.serial)}</td><td>${esc(p.createdAt.slice(0,10))}</td><td>${esc(p.vendorCode+' '+p.vendor)}</td><td>${money(p.amountDue)}</td><td>${money(p.amountPaid)}</td><td>${esc(voucher(p))}</td><td>${esc(p.status)}</td></tr>`).join('')}</tbody></table></div>`}
$('#buildReport').onclick=buildReport;$('#printReport').onclick=()=>{const a=reportData(),total=a.reduce((x,p)=>x+Number(p.amountPaid||0),0),ded=a.reduce((x,p)=>x+Number(p.deductionAmount||0),0),name=$('#reportVendor').selectedOptions[0]?.text||'全部廠商';const body=`<h1>${esc(getSystemName())}－廠商付款報表</h1><div class="sub">廠商：${esc(name)}　期間：${esc($('#reportStart').value)} ～ ${esc($('#reportEnd').value)}</div><div class="summaryline">付款筆數：${a.length} 筆　實付合計：NT$ ${money(total)}　扣款合計：NT$ ${money(ded)}</div><table class="report-table"><thead><tr><th>序號</th><th>日期</th><th>廠商</th><th>應付</th><th>實付</th><th>付款憑證</th><th>狀態</th></tr></thead><tbody>${a.map(p=>`<tr><td>${esc(p.serial)}</td><td>${esc(p.createdAt.slice(0,10))}</td><td>${esc(p.vendorCode+' '+p.vendor)}</td><td>${money(p.amountDue)}</td><td>${money(p.amountPaid)}</td><td>${esc(voucher(p))}</td><td>${esc(p.status)}</td></tr>`).join('')}</tbody></table><div class="foot">列印時間：${new Date().toLocaleString('zh-TW')}</div>`;printDocument(getSystemName()+' 廠商付款報表',body)};$('#exportCsv').onclick=()=>{const a=reportData(),rows=[['序號','日期','廠商代號','廠商名稱','應付金額','比例','實付金額','扣款','付款憑證','狀態'],...a.map(p=>[p.serial,p.createdAt.slice(0,10),p.vendorCode,p.vendor,p.amountDue,p.rate,p.amountPaid,p.deductionAmount,voucher(p),p.status])],csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n'),blob=new Blob([csv],{type:'text/csv'}),x=document.createElement('a');x.href=URL.createObjectURL(blob);x.download=getSystemName()+'_付款報表.csv';x.click();URL.revokeObjectURL(x.href)};
let editingVendorCode='';
function renderVendorManager(){
  const q=($('#vendorSearchManage')?.value||'').trim().toLowerCase();
  const list=db.vendors.filter(v=>!q||`${v.code} ${v.name}`.toLowerCase().includes(q));
  $('#vendorManageRows').innerHTML=list.length?list.map(v=>`<div class="vendor-row"><b>${esc(v.code)}</b><span>${esc(v.name)}</span><div><button class="secondary" data-ev="${esc(v.code)}">修改</button> <button class="secondary danger" data-dvm="${esc(v.code)}">停用</button></div></div>`).join(''):'<p class="hint">尚無符合的廠商。</p>';
  $$('[data-ev]').forEach(b=>b.onclick=()=>{const v=db.vendors.find(x=>x.code===b.dataset.ev);if(!v)return;editingVendorCode=v.code;$('#vendorCodeManage').value=v.code;$('#vendorNameManage').value=v.name;$('#saveVendorManage').textContent='儲存修改';window.scrollTo({top:0,behavior:'smooth'})});
  $$('[data-dvm]').forEach(b=>b.onclick=()=>{const code=b.dataset.dvm;if(confirm('停用這個廠商？舊付款資料會保留。')){db.vendors=db.vendors.filter(v=>v.code!==code);save();renderVendorManager();renderLists()}});
}
$('#vendorSearchManage').oninput=renderVendorManager;
$('#saveVendorManage').onclick=()=>{const code=$('#vendorCodeManage').value.trim(),name=$('#vendorNameManage').value.trim();if(!code||!name)return toast('請填廠商代號與名稱');if(editingVendorCode){if(code!==editingVendorCode&&db.vendors.some(v=>v.code===code))return toast('廠商代號不可重複');const v=db.vendors.find(v=>v.code===editingVendorCode);if(v){v.code=code;v.name=name;db.payments.forEach(p=>{if(p.vendorCode===editingVendorCode){p.vendorCode=code;p.vendor=name}})}editingVendorCode='';$('#saveVendorManage').textContent='新增';toast('廠商資料已修改')}else{if(db.vendors.some(v=>v.code===code))return toast('廠商代號不可重複');db.vendors.push({code,name});toast('廠商已新增')}$('#vendorCodeManage').value='';$('#vendorNameManage').value='';db.vendors.sort((a,b)=>a.code.localeCompare(b.code,'zh-Hant',{numeric:true}));save();renderVendorManager();renderLists()};
function renderSettings(){$('#systemNameInput').value=getSystemName();const hl={payment:'新增付款',settlement:'查詢付款資料',reminder:'支票管理',report:'報表中心',...(settings.homeLabels||{})};$('#homeLabelPayment').value=hl.payment;$('#homeLabelSettlement').value=hl.settlement;$('#homeLabelReminder').value=hl.reminder;$('#homeLabelReport').value=hl.report;$('#autoBackupToggle').checked=settings.autoBackup;renderBackupStatus();renderStorageStatus();$('#bankChips').innerHTML=db.banks.map((v,i)=>`<button class="chip" data-db="${i}">${esc(v)} ×</button>`).join('');$('#methodChips').innerHTML=db.methods.map((v,i)=>`<button class="chip" data-dm="${i}">${esc(v)} ×</button>`).join('');$$('[data-db]').forEach(x=>x.onclick=()=>{const n=db.banks[+x.dataset.db];db.banks.splice(+x.dataset.db,1);delete db.checks[n];save();renderSettings()});$$('[data-dm]').forEach(x=>x.onclick=()=>{const v=db.methods[+x.dataset.dm];if(['現金','支票','郵寄支票','轉帳','匯款'].includes(v))return toast('基本付款方式不可刪除');db.methods.splice(+x.dataset.dm,1);save();renderSettings()})}

$('#saveSystemName').onclick=()=>{const name=$('#systemNameInput').value.trim();if(!name)return toast('請輸入系統名稱');settings.systemName=name.slice(0,30);saveSettings();applySystemName();buildReport();toast('系統名稱已更新')};
$('#resetSystemName').onclick=()=>{if(!confirm('確定恢復成「雙發付款管理系統」？'))return;settings.systemName='雙發付款管理系統';saveSettings();applySystemName();renderSettings();buildReport();toast('已恢復預設名稱')};
$('#saveHomeLabels').onclick=()=>{settings.homeLabels={payment:$('#homeLabelPayment').value.trim()||'新增付款',settlement:$('#homeLabelSettlement').value.trim()||'查詢付款資料',reminder:$('#homeLabelReminder').value.trim()||'支票管理',report:$('#homeLabelReport').value.trim()||'報表中心'};saveSettings();applyHomeLabels();toast('首頁文字已更新')};$('#resetHomeLabels').onclick=()=>{if(!confirm('確定恢復首頁預設文字？'))return;settings.homeLabels={payment:'新增付款',settlement:'查詢付款資料',reminder:'支票管理',report:'報表中心'};saveSettings();applyHomeLabels();renderSettings();toast('已恢復預設文字')};
$('#addBank').onclick=()=>{const v=$('#newBank').value.trim();if(!v)return;if(!db.banks.includes(v))db.banks.push(v);db.checks[v]??=[];$('#newBank').value='';save();renderSettings()};$('#addMethod').onclick=()=>{const v=$('#newMethod').value.trim();if(v&&!db.methods.includes(v))db.methods.push(v);$('#newMethod').value='';save();renderSettings()};
$('#autoBackupToggle').onchange=e=>{settings.autoBackup=e.target.checked;saveSettings();renderBackupStatus()};function renderBackupStatus(){const snaps=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]'),last=localStorage.getItem('shuangfa_last_backup');$('#backupStatus').innerHTML=`自動備份：<b>${settings.autoBackup?'開啟':'關閉'}</b><br>手機內備份：${snaps.length} 份<br>最近完整備份：${last?new Date(last).toLocaleString('zh-TW'):'尚未備份'}`}
function backupFileName(){const d=new Date(),z=n=>String(n).padStart(2,'0');return `雙發付款完整備份_${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}_${z(d.getHours())}-${z(d.getMinutes())}.json`}
function downloadBackup(msg=true){const payload={app:getSystemName(),version:'V8.3 DEV Build 010・登入語音完整修正版',backupAt:new Date().toISOString(),data:db,settings},blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=backupFileName();a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);localStorage.setItem('shuangfa_last_backup',new Date().toISOString());renderBackupStatus();renderStorageStatus();if(msg){toast('完整備份檔已產生');speak('資料已備份完成。')}}
$('#exportBtn').onclick=()=>downloadBackup(true);$('#compressPhotosBtn')?.addEventListener('click',compressAllPhotosSafely);$('#importInput').onchange=async e=>{try{const raw=JSON.parse(await e.target.files[0].text()),x=raw.data||raw;if(!x.payments||!x.vendors)throw 0;db=migrate(x);if(raw.settings)settings=raw.settings;save();saveSettings();renderLists();renderSettings();toast('完整備份已還原')}catch{toast('備份檔格式不正確')}};
function createOpeningBackup(){try{if(!settings.autoBackup)return;const day=new Date().toISOString().slice(0,10),tag='open-'+day,a=JSON.parse(localStorage.getItem(BACKUP_KEY)||'[]');if(a.some(x=>x.tag===tag))return;const slim=structuredClone(db);slim.payments=(slim.payments||[]).map(x=>({...x,invoicePhotos:[],checkPhoto:'',signatureData:''}));a.unshift({at:new Date().toISOString(),tag,reason:'開啟系統自動備份',data:slim});localStorage.setItem(BACKUP_KEY,JSON.stringify(a.slice(0,7)));localStorage.setItem('shuangfa_last_auto_backup',new Date().toISOString())}catch(e){console.error('開啟自動備份失敗',e)}}
function renderDue(){const t=new Date();t.setHours(0,0,0,0);const tm=new Date(t);tm.setDate(t.getDate()+1);const a=db.payments.filter(p=>p.status!=='已銷帳'&&p.status!=='作廢').filter(p=>{const ds=p.method==='支票'?p.checkDueDate:p.transferDate;if(!ds)return false;const d=new Date(ds+'T00:00:00');return d.getTime()===t.getTime()||d.getTime()===tm.getTime()||d<t});$('#dueNotice').classList.toggle('hidden',!a.length);if(a.length)$('#dueNotice').innerHTML='<b>🔔 付款提醒</b><br>'+a.map(p=>`${esc(p.serial)}｜${esc(p.vendor)}｜${esc(voucher(p))}｜$${money(p.amountPaid)}｜${esc(p.status)}`).join('<br>')}


// ===== AI 照片辨識（測試版） =====
function normalizeDigits(s=''){return s.replace(/[OoＯ]/g,'0').replace(/[Il｜]/g,'1').replace(/[,，\s]/g,'')}
function parseOcrText(text){
  const raw=text||'', compact=raw.replace(/\s+/g,' ');
  const result={raw};
  const vendor=db.vendors.find(v=>compact.includes(v.code)||compact.includes(v.name));
  if(vendor){result.vendorCode=vendor.code;result.vendor=vendor.name}
  const bankMap=[['彰化銀行','彰化銀行'],['彰銀','彰化銀行'],['板信銀行','板信銀行'],['板信','板信銀行'],['臺灣銀行','臺灣銀行'],['台灣銀行','臺灣銀行'],['合作金庫','合作金庫'],['第一銀行','第一銀行'],['華南銀行','華南銀行'],['國泰世華','國泰世華'],['中國信託','中國信託']];
  for(const [k,v] of bankMap){if(compact.includes(k)){result.bank=v;break}}
  const dates=[...compact.matchAll(/(20\d{2}|1\d{2})[\/\.\-年](\d{1,2})[\/\.\-月](\d{1,2})日?/g)];
  if(dates.length){let [,y,m,d]=dates[0];if(+y<1911)y=String(+y+1911);result.date=`${y}-${String(+m).padStart(2,'0')}-${String(+d).padStart(2,'0')}`}
  const moneyMatches=[...compact.matchAll(/(?:NT\$|NTD|新臺幣|新台幣|金額|合計|實付)?\s*[$＄]?\s*([0-9０-９][0-9０-９,，]{2,})(?:\s*元)?/g)].map(m=>Number(normalizeDigits(m[1]).replace(/[０-９]/g,c=>String('０１２３４５６７８９'.indexOf(c))))).filter(n=>Number.isFinite(n)&&n>=100&&n<100000000);
  if(moneyMatches.length)result.amount=Math.max(...moneyMatches);
  const checkMatch=compact.match(/(?:票號|支票號碼|號碼)[:：\s]*([0-9０-９Oo]{5,12})/i)||compact.match(/\b([0-9０-９]{7,10})\b/);
  if(checkMatch)result.checkNumber=formatCheckNo(normalizeDigits(checkMatch[1]).replace(/[０-９]/g,c=>String('０１２３４５６７８９'.indexOf(c))));
  return result;
}
function renderOcrResult(r){
  const lines=[];
  if(r.vendor)lines.push(`廠商：${r.vendorCode}－${r.vendor}`);
  if(r.bank)lines.push(`銀行：${r.bank}`);
  if(r.checkNumber)lines.push(`支票號碼：${r.checkNumber}`);
  if(r.date)lines.push(`日期：${r.date}`);
  if(r.amount)lines.push(`辨識金額：$${money(r.amount)}`);
  if(!lines.length)lines.push('目前沒有辨識出可自動帶入的欄位，請查看原始文字並手動輸入。');
  const el=$('#ocrResult');el.classList.remove('hidden');
  el.innerHTML=`<b>辨識結果（請人工確認）</b><br>${lines.map(esc).join('<br>')}<button id="applyOcr" class="primary full">確認並帶入資料</button><details><summary>查看辨識原始文字</summary><div class="mini">${esc((r.raw||'').slice(0,3000))}</div></details>`;
  $('#applyOcr').onclick=()=>{
    if(r.vendor){draft.vendorCode=r.vendorCode;draft.vendor=r.vendor;$('#vendorInput').value=`${r.vendorCode}－${r.vendor}`}
    if(r.amount){$('#amountDue').value=r.amount;updateCalculation()}
    if(r.bank){draft.bank=r.bank;$('#selectedBank').value=r.bank}
    if(r.checkNumber)draft.checkNumber=r.checkNumber;
    if(r.date){if(draft.method==='支票')$('#checkDueDate').value=r.date;else if(draft.method==='轉帳')$('#transferDate').value=r.date}
    toast('AI 辨識資料已帶入，請再檢查一次');
  }
}
$('#runOcr').onclick=async()=>{
  const imgs=[...invoicePhotos,checkPhoto].filter(Boolean);
  if(!imgs.length)return toast('請先拍攝請款單或支票');
  if(!window.Tesseract)return toast('AI 辨識元件尚未載入，請確認網路連線');
  const btn=$('#runOcr'),progress=$('#ocrProgress');btn.disabled=true;btn.textContent='辨識中…';progress.textContent='準備辨識模型…';
  try{
    let all='';
    for(let i=0;i<imgs.length;i++){
      const res=await Tesseract.recognize(imgs[i],'chi_tra+eng',{logger:m=>{if(m.status==='recognizing text')progress.textContent=`辨識第 ${i+1}/${imgs.length} 張：${Math.round((m.progress||0)*100)}%`;else progress.textContent=`第 ${i+1}/${imgs.length} 張：${m.status||'處理中'}`}});
      all+='\n'+(res.data?.text||'');
    }
    renderOcrResult(parseOcrText(all));progress.textContent='辨識完成。請確認結果後再帶入。';
  }catch(err){console.error(err);progress.textContent='辨識失敗，請確認網路，或換一張光線較亮、文字較清楚的照片。';toast('AI 辨識失敗')}
  finally{btn.disabled=false;btn.textContent='✨ 重新 AI 辨識'}
};

applySystemName();applyHomeLabels();createOpeningBackup();renderLists();renderDue();renderStorageStatus();



// ===== Build 009：付款照片點選放大 =====
function openPhotoViewer(src){
  if(!src)return;
  const viewer=$('#photoViewer'), img=$('#photoViewerImage');
  if(!viewer||!img)return;
  img.src=src;
  viewer.classList.remove('hidden');
  viewer.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closePhotoViewer(){
  const viewer=$('#photoViewer'), img=$('#photoViewerImage');
  if(!viewer)return;
  viewer.classList.add('hidden');
  viewer.setAttribute('aria-hidden','true');
  if(img)img.src='';
  document.body.style.overflow='';
}
document.addEventListener('click',e=>{
  const photo=e.target.closest('#detailImages img');
  if(photo){e.preventDefault();openPhotoViewer(photo.src);return;}
  if(e.target.id==='closePhotoViewer'||e.target.id==='photoViewer')closePhotoViewer();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePhotoViewer()});

// ===== V8.3 DEV Build 010・登入語音完整修正版：PWA 安裝與更新 =====
function updateOfflineStatus(){
  const el=document.querySelector('#offlineStatus');
  if(!el)return;
  el.innerHTML=navigator.onLine
    ? '目前：<b>已連線</b>。系統可檢查新版；斷網後仍可使用。'
    : '目前：<b>離線使用中</b>。新增、查詢、簽名、列印與備份仍可操作。';
}
window.addEventListener('online',updateOfflineStatus);
window.addEventListener('offline',updateOfflineStatus);
updateOfflineStatus();

let swRegistration=null;
if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      swRegistration=await navigator.serviceWorker.register('./sw.js?v=8314',{scope:'./',updateViaCache:'none'});
      updateOfflineStatus();
    }catch(err){
      console.error('離線功能安裝失敗',err);
      const el=document.querySelector('#offlineStatus');
      if(el)el.textContent='離線功能尚未安裝成功，請連網重新開啟一次。';
    }
  });
  let refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(refreshing)return;
    refreshing=true;
    location.reload();
  });
}
const updateBtn=document.querySelector('#checkUpdateBtn');
if(updateBtn)updateBtn.onclick=async()=>{
  if(!navigator.onLine)return toast('目前沒有網路，無法檢查更新');
  updateBtn.disabled=true;
  updateBtn.textContent='正在檢查更新…';
  try{
    if(!swRegistration)swRegistration=await navigator.serviceWorker.getRegistration('./');
    if(swRegistration){
      await swRegistration.update();
      toast('已完成檢查；若有新版會自動更新並重新開啟');
    }else{
      toast('離線功能尚未安裝，請重新整理頁面');
    }
  }catch(err){
    console.error(err);
    toast('檢查更新失敗，請稍後再試');
  }finally{
    updateBtn.disabled=false;
    updateBtn.textContent='連網時檢查更新';
  }
};


// ===== V8.3 DEV Build 014：清除付款資料與本日郵寄清單 =====
function todayMailItems(dateValue){
  const d=dateValue||new Date().toISOString().slice(0,10);
  return db.payments.filter(p=>p.method==='郵寄支票'&&((p.mailDate||'')===d||(!p.mailDate&&(p.createdAt||'').slice(0,10)===d)));
}
function renderTodayMail(){
  const input=$('#todayMailDate');if(!input)return;
  if(!input.value)input.value=new Date().toISOString().slice(0,10);
  const a=todayMailItems(input.value),total=a.reduce((s,p)=>s+Number(p.amountPaid||0),0);
  const stickers=[...new Set(a.map(p=>p.mailStickerNumber).filter(Boolean))];
  $('#todayMailSummary').innerHTML=`寄件日期：<b>${esc(input.value)}</b><br>共 <b>${a.length}</b> 筆｜合計 <b>NT$ ${money(total)}</b><br>郵寄貼紙號碼：${stickers.length?stickers.map(esc).join('、'):'尚未填寫'}`;
  $('#todayMailList').innerHTML=a.length?a.map((p,i)=>`<div class="record"><h3>${i+1}. ${esc(p.vendorCode||'')} ${esc(p.vendor||'')}</h3><div class="meta">支票號碼：${esc(p.checkNumber||'—')}<br>到期日：${esc(p.checkDueDate||'—')}｜金額：NT$ ${money(p.amountPaid)}<br>貼紙號碼：${esc(p.mailStickerNumber||'—')}</div><button class="secondary full" data-mail-detail="${p.id}">查看明細</button></div>`).join(''):'<p class="hint">這一天沒有郵寄支票資料。</p>';
  $$('[data-mail-detail]').forEach(b=>b.onclick=()=>openDetail(b.dataset.mailDetail));
}
function printTodayMailList(){
  const date=$('#todayMailDate')?.value||new Date().toISOString().slice(0,10),a=todayMailItems(date);
  if(!a.length)return toast('這一天沒有郵寄支票資料');
  const stickers=[...new Set(a.map(p=>p.mailStickerNumber).filter(Boolean))].join('、');
  printMailBatch(a,a.length,stickers,date);
}
async function clearPaymentDataSafely(){
  if(!db.payments.length&&!db.auditLogs?.length&&!db.corrections?.length)return toast('目前沒有付款資料可以清除');
  if(!confirm('系統會先下載完整備份，再清除所有付款紀錄、照片、簽名及修改紀錄。\n\n廠商、銀行、登入帳號與密碼都會保留。\n\n確定繼續嗎？'))return;
  downloadBackup();
  const typed=prompt('為避免誤刪，請輸入「清除」兩個字：','');
  if(typed!=='清除')return toast('輸入不正確，已取消清除資料');
  db.payments=[];
  db.auditLogs=[];
  db.corrections=[];
  Object.keys(db.checks||{}).forEach(bank=>db.checks[bank]=(db.checks[bank]||[]).map(x=>({...x,status:'未使用'})));
  mailBatchSession={ids:[],stickerNumber:'',mailDate:'',expectedCount:0};
  save();renderLists();renderStorageStatus();renderTodayMail();
  toast('付款資料已清除，廠商、設定及登入資料均已保留');
  if(window.shuangfaSpeak)window.shuangfaSpeak('付款資料已清除，備份已經完成。','success');
  alert('清除完成。\n\n已清除：付款紀錄、照片、簽名、修改紀錄。\n已保留：廠商、銀行、系統設定、登入帳號與密碼。');
  show('home');
}
document.addEventListener('DOMContentLoaded',()=>{
  const d=$('#todayMailDate');if(d)d.value=new Date().toISOString().slice(0,10);
  $('#refreshTodayMail')?.addEventListener('click',renderTodayMail);
  $('#todayMailDate')?.addEventListener('change',renderTodayMail);
  $('#printTodayMail')?.addEventListener('click',printTodayMailList);
  $('#clearPaymentDataBtn')?.addEventListener('click',clearPaymentDataSafely);
});
const _showBuild014=show;
show=function(id,push=true){_showBuild014(id,push);if(id==='todayMail')renderTodayMail();};
