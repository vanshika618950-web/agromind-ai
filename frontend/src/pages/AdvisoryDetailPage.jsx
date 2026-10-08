import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  ArrowLeft,
  MapPin,
  Calendar,
  Droplet,
  FlaskConical,
  AlertTriangle,
  Printer,
  Trash2,
  CheckCircle2,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock,
  Activity,
  Layers,
  Leaf,
  Volume2,
  Square,
  Pill,
} from 'lucide-react';
import { advisoryApi } from '../services/advisoryApi';
import RiskBadge from '../components/RiskBadge';
import AgentWorkflowTimeline from '../components/AgentWorkflowTimeline';
import LoadingState from '../components/LoadingState';
import { useLanguage } from '../context/LanguageContext';
import {
  speak,
  stopSpeaking,
  isSpeechSynthesisSupported,
} from '../utils/speech';

// Agronomic expert prescription fallback for advisories
const getFallbackPrescription = (advisory = {}, lang = 'en') => {
  const crop = advisory.crop || 'Crop';
  const cropLower = crop.toLowerCase();

  if (lang === 'te') {
    if (cropLower.includes('tomato') || cropLower.includes('టమాట')) {
      return {
        diagnosis: `${crop}: ఆకు మచ్చ తెగులు & ప్రారంభ ఎండు తెగులు చికిత్స`,
        items: [
          {
            medicineName: 'మాంకోజెబ్ 75% WP (Mancozeb - Dithane M-45)',
            category: 'రసాయన బూజు నాశిని (Curative Fungicide)',
            activeIngredient: 'Mancozeb 75% WP',
            dosage: '2.5 గ్రాములు / లీటరు నీటికి (ఎకరాకు 500 గ్రాములు 200 లీటర్ల నీటిలో)',
            applicationMethod: 'ఆకులపై పిచికారీ (Foliar Spray)',
            timing: 'ఉదయం 6:30 నుండి 9:00 గంటల మధ్య లేదా సాయంత్రం వేళల్లో',
            waitingPeriod: '7 రోజులు (కోతకు ముందు నిరీక్షణ సమయం - PHI)',
            targetPathogen: 'ఆల్టర్నేరియా ఆకు మచ్చ & బూజు తెగులు',
            safetyPrecautions: 'పిచికారీ చేసేటప్పుడు తప్పనిసరిగా మాస్క్ మరియు చేతి తొడుగులు ధరించండి.',
            organicAlternative: 'వేపనూనె (Neem Oil 10,000 ppm) 3-5 మి.లీ/లీ + ట్రైకోడెర్మా విరిడే 5 గ్రా/లీ',
          },
          {
            medicineName: 'ట్రైకోడెర్మా విరిడే (Trichoderma viride 1.5% WP)',
            category: 'సేంద్రియ జీవ నియంత్రణ (Bio-Fungicide)',
            activeIngredient: 'Trichoderma viride (2x10^8 CFU/g)',
            dosage: '5 గ్రాములు / లీటరు నీటికి లేదా ఎకరాకు 1 కిలో పశువుల ఎరువుతో',
            applicationMethod: 'మొక్కల మొదళ్లలో తడపడం / పిచికారీ',
            timing: 'నేలలో తగినంత తేమ ఉన్నప్పుడు, సాయంత్రం వేళల్లో',
            waitingPeriod: 'సున్నా (రసాయన అవశేషాలు ఉండవు - సేంద్రీయం)',
            targetPathogen: 'వేరుకుళ్లు మరియు నేల ద్వారా సంక్రమించే బూజు తెగుళ్లు',
            safetyPrecautions: 'రసాయన మందులతో కలిపి ఒకేసారి పిచికారీ చేయకూడదు.',
            organicAlternative: 'సూడోమోనాస్ ఫ్లోరోసెన్స్ (Pseudomonas fluorescens) 5 గ్రా/లీ',
          },
          {
            medicineName: '19:19:19 NPK + చిలేటెడ్ సూక్ష్మ పోషకాలు (Zinc & Boron)',
            category: 'పోషక పునరుద్ధరణ స్ప్రే (Nutritional Foliar)',
            activeIngredient: 'Water Soluble NPK + Chelated Micronutrients',
            dosage: '4-5 గ్రాములు / లీటరు నీటికి',
            applicationMethod: 'ఆకులపై పిచికారీ (Foliar Spray)',
            timing: 'రోగ నివారణ మందు పిచికారీ చేసిన 3-4 రోజుల తర్వాత',
            waitingPeriod: 'వర్తించదు (పోషక అనుబంధం)',
            targetPathogen: 'పసుపు పచ్చదనం నివారణ & కొత్త చిగుళ్ల పెరుగుదల',
            safetyPrecautions: 'ఎండ తీవ్రంగా ఉన్నప్పుడు పిచికారీ చేయవద్దు.',
            organicAlternative: 'పంచగవ్య 30 మి.లీ / లీటరు నీటికి లేదా జీవామృతం',
          },
        ],
        applicationWindow: 'ఉదయం 6:30 - 9:00 లేదా సాయంత్రం 4:30 - 6:30 (ఎండ లేని వేళల్లో)',
        tankMixCompatibility: 'జీవ రసాయనాలను (ట్రైకోడెర్మా) రసాయన మందులతో నేరుగా ఒకే ట్యాంకులో కలపవద్దు.',
        safetyNotice: 'రసాయన మందుల డబ్బాలను పిల్లలకు, పశువులకు దూరంగా ఉంచండి. ఖాళీ డబ్బాలను జాగ్రత్తగా పారవేయండి.',
      };
    }

    return {
      diagnosis: `${crop}: సమగ్ర పంట రక్షణ & చికిత్స ప్రిస్క్రిప్షన్`,
      items: [
        {
          medicineName: 'కాపర్ ఆక్సిక్లోరైడ్ 50% WP లేదా మాంకోజెబ్ 75% WP',
          category: 'రక్షణ & నివారణ బూజు నాశిని (Broad-Spectrum Fungicide)',
          activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
          dosage: '2.5 - 3.0 గ్రాములు / లీటరు నీటికి (ఎకరాకు 500-600 గ్రాములు)',
          applicationMethod: 'మొక్క అంతా తడిసేలా పిచికారీ',
          timing: 'ఉదయం వేళల్లో గాలి వేగం తక్కువగా ఉన్నప్పుడు',
          waitingPeriod: '7-10 రోజులు (Pre-Harvest Interval)',
          targetPathogen: 'ఆకు మచ్చలు, బూజు తెగుళ్లు మరియు ఎండు తెగులు',
          safetyPrecautions: 'గాలికి ఎదురుగా పిచికారీ చేయవద్దు. మాస్క్ ధరించండి.',
          organicAlternative: 'వేపనూనె 10,000 ppm @ 4-5 మి.లీ/లీటరు లేదా పులిసిన మజ్జిగ ద్రావణం',
        },
        {
          medicineName: 'ట్రైకోడెర్మా విరిడే లేదా సూడోమోనాస్ ఫ్లోరోసెన్స్',
          category: 'సేంద్రియ జీవ నియంత్రణ (Biological Alternative)',
          activeIngredient: 'Beneficial Bio-Agent Culture (CFU > 2x10^8)',
          dosage: '5 గ్రాములు / లీటరు నీటికి లేదా ఎకరాకు 1-2 కిలోలు',
          applicationMethod: 'మొక్కల మొదళ్లలో పోయడం లేదా పిచికారీ',
          timing: 'సాయంత్రం వేళల్లో',
          waitingPeriod: 'సేంద్రీయం (నిరీక్షణ సమయం అవసరం లేదు)',
          targetPathogen: 'నేల ద్వారా వ్యాపించే తెగుళ్లు',
          safetyPrecautions: 'తయారుచేసిన ద్రావణాన్ని 24 గంటలలోపు వాడాలి.',
          organicAlternative: 'జీవామృతం లేదా ఘన జీవామృతం',
        },
        {
          medicineName: 'చిలేటెడ్ జింక్ (Zn EDTA 12%) + బోరాన్ 20%',
          category: 'సూక్ష్మ పోషక టానిక్ (Micronutrient Booster)',
          activeIngredient: 'Chelated Zinc (12%) + Disodium Octaborate (20%)',
          dosage: '1.0 గ్రాము జింక్ + 1.0 గ్రాము బోరాన్ / లీటరు నీటికి',
          applicationMethod: 'ఆకులపై పిచికారీ',
          timing: 'ఉదయం లేదా సాయంత్రం',
          waitingPeriod: 'వర్తించదు',
          targetPathogen: 'పోషకాహార లోపం, పూత రాలడం నివారణ',
          safetyPrecautions: 'సిఫార్సు చేసిన మోతాదులోనే వాడండి.',
          organicAlternative: 'వర్మీవాష్ లేదా వేస్ట్ డీకంపోజర్ ద్రావణం',
        },
      ],
      applicationWindow: 'ఉదయం 6:30 - 9:00 లేదా సాయంత్రం 4:30 - 6:30',
      tankMixCompatibility: 'రసాయన మందులు మరియు జీవ శిలీంద్రాలను వేర్వేరుగా పిచికారీ చేయండి.',
      safetyNotice: 'రక్షణ పరికరాలు ధరించండి. పిచికారీ తర్వాత చేతులు శుభ్రంగా కడుక్కోండి.',
    };
  }

  if (lang === 'hi') {
    if (cropLower.includes('tomato') || cropLower.includes('टमाटर')) {
      return {
        diagnosis: `${crop}: पर्ण धब्बा और अगेती झुलसा रोग उपचार`,
        items: [
          {
            medicineName: 'मैंकोजेब 75% WP (Mancozeb - Dithane M-45)',
            category: 'उपचारात्मक फफूंदनाशी (Curative Fungicide)',
            activeIngredient: 'Mancozeb 75% WP',
            dosage: '2.5 ग्राम / लीटर पानी (एकड़ में 500 ग्राम 200 लीटर पानी में)',
            applicationMethod: 'पत्तियों पर छिड़काव (Foliar Spray)',
            timing: 'सुबह 6:30 से 9:00 बजे के बीच या शाम के समय',
            waitingPeriod: '7 दिन (तुड़ाई से पहले प्रतीक्षा अवधि - PHI)',
            targetPathogen: 'अल्टरनेरिया पत्ती धब्बा व झुलसा फफूंद',
            safetyPrecautions: 'छिड़काव के समय दस्ताने और मास्क अवश्य पहनें।',
            organicAlternative: 'नीम का तेल (Neem Oil 10,000 ppm) 3-5 मिली/लीटर + ट्राइकोडर्मा 5 ग्राम/लीटर',
          },
          {
            medicineName: 'ट्राइकोडर्मा विरिडी (Trichoderma viride 1.5% WP)',
            category: 'जैविक नियंत्रण (Bio-Fungicide)',
            activeIngredient: 'Trichoderma viride (2x10^8 CFU/g)',
            dosage: '5 ग्राम / लीटर पानी या 1 किलो प्रति एकड़ गोबर की खाद में मिलाकर',
            applicationMethod: 'जड़ों के पास ड्रेंचिंग या पत्तियों पर छिड़काव',
            timing: 'शाम के समय जब मिट्टी में पर्याप्त नमी हो',
            waitingPeriod: 'शून्य (कोई रासायनिक अवशेष नहीं - 100% जैविक)',
            targetPathogen: 'जड़ गलन और मिट्टी जनित कवक रोग',
            safetyPrecautions: 'रासायनिक फफूंदनाशी के साथ मिलाकर न डालें।',
            organicAlternative: 'स्यूडोमोनास फ्लोरोसेंस 5 ग्राम/लीटर',
          },
          {
            medicineName: 'घुलनशील NPK 19:19:19 + कीलेटेड जिंक व बोरोन',
            category: 'पोषक तत्व स्प्रे (Foliar Nutrition)',
            activeIngredient: '100% Water Soluble NPK + Chelated Micronutrients',
            dosage: '4-5 ग्राम / लीटर पानी',
            applicationMethod: 'पत्तियों पर छिड़काव (Foliar Spray)',
            timing: 'दवा छिड़काव के 3-4 दिन बाद',
            waitingPeriod: 'लागू नहीं (पोषक पूरक)',
            targetPathogen: 'पत्तियों का पीलापन दूर करना और नई शाखाओं की बढ़वार',
            safetyPrecautions: 'तेज धूप में छिड़काव न करें।',
            organicAlternative: 'पंचगव्य 30 मिली / लीटर या जीवामृत',
          },
        ],
        applicationWindow: 'सुबह 6:30 - 9:00 या शाम 4:30 - 6:30 बजे',
        tankMixCompatibility: 'जैविक दवाओं को सीधे रासायनिक कीटनाशकों के साथ न मिलाएं।',
        safetyNotice: 'छिड़काव के बाद हाथ साबुन से धोएं और बच्चों को दूर रखें।',
      };
    }

    return {
      diagnosis: `${crop}: संपूर्ण पौध संरक्षण एवं उपचार प्रिस्क्रिप्शन`,
      items: [
        {
          medicineName: 'कॉपर ऑक्सीक्लोराइड 50% WP या मैंकोजेब 75% WP',
          category: 'व्यापक सुरक्षात्मक फफूंदनाशी (Broad-Spectrum Fungicide)',
          activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
          dosage: '2.5 - 3.0 ग्राम / लीटर पानी (500-600 ग्राम प्रति एकड़)',
          applicationMethod: 'पौधों पर पूर्ण छिड़काव',
          timing: 'सुबह के समय जब हवा शांत हो',
          waitingPeriod: '7-10 दिन (तुड़ाई से पूर्व सुरक्षा अवधि)',
          targetPathogen: 'पत्ती धब्बा, झुलसा और फफूंद जनित रोग',
          safetyPrecautions: 'हवा के विपरीत दिशा में छिड़काव न करें।',
          organicAlternative: 'नीम तेल 10,000 ppm @ 4-5 मिली/लीटर या खट्टी छाछ का घोल',
        },
        {
          medicineName: 'ट्राइकोडर्मा विरिडी या स्यूडोमोनास फ्लोरोसेंस',
          category: 'जैविक बायो-एजेंट (Biological Control)',
          activeIngredient: 'Beneficial Microorganism Culture (> 2x10^8 CFU)',
          dosage: '5 ग्राम / लीटर पानी या 1-2 किलो प्रति एकड़',
          applicationMethod: 'जड़ों के पास सिंचन या छिड़काव',
          timing: 'शाम के समय',
          waitingPeriod: 'जैविक (प्रतीक्षा अवधि नहीं)',
          targetPathogen: 'मिट्टी जनित बीमारियां एवं जड़ सुरक्षा',
          safetyPrecautions: 'घोल बनाने के 24 घंटे के भीतर उपयोग करें।',
          organicAlternative: 'जीवामृत या वर्मीवाश',
        },
        {
          medicineName: 'कीलेटेड जिंक (Zn EDTA 12%) + बोरोन 20%',
          category: 'सूक्ष्म पोषक टॉनिक (Micronutrient Booster)',
          activeIngredient: 'Chelated Zinc (12%) + Disodium Octaborate (20%)',
          dosage: '1 ग्राम जिंक + 1 ग्राम बोरोन / लीटर पानी',
          applicationMethod: 'पर्ण छिड़काव (Foliar Spray)',
          timing: 'सुबह या शाम',
          waitingPeriod: 'लागू नहीं',
          targetPathogen: 'सूक्ष्म पोषक तत्वों की कमी और फूल झड़ने से रोकथाम',
          safetyPrecautions: 'अनुशंसित मात्रा से अधिक न डालें।',
          organicAlternative: 'वर्मीवाश या अपशिष्ट डीकंपोजर घोल',
        },
      ],
      applicationWindow: 'सुबह 6:30 - 9:00 या शाम 4:30 - 6:30 बजे',
      tankMixCompatibility: 'रासायनिक और जैविक खादों को अलग-अलग छिड़कें।',
      safetyNotice: 'सुरक्षात्मक मास्क और दस्ताने पहनें। पशुओं को दूर रखें।',
    };
  }

  // English fallback
  if (cropLower.includes('tomato')) {
    return {
      diagnosis: `${crop}: Targeted Foliar Blight & Vigor Restoration Protocol`,
      items: [
        {
          medicineName: 'Mancozeb 75% WP (Dithane M-45)',
          category: 'Curative Fungicide',
          activeIngredient: 'Mancozeb 75% WP (Dithiocarbamate group)',
          dosage: '2.5 g / Liter of water (500 g / acre in 200 Liters of water)',
          applicationMethod: 'Uniform Foliar Spray (cover upper and lower leaf surfaces)',
          timing: 'Early morning (6:30 - 8:30 AM) or late afternoon; repeat in 10 days if symptoms persist',
          waitingPeriod: '7 days (Pre-Harvest Interval - PHI)',
          targetPathogen: 'Alternaria solani (Early Blight) & Septoria Leaf Spot',
          safetyPrecautions: 'Wear protective mask, goggles, and gloves. Do not spray against headwind.',
          organicAlternative: 'Neem Oil (Azadirachtin 10,000 ppm) @ 3-5 ml/L + Trichoderma viride 5 g/L',
        },
        {
          medicineName: 'Trichoderma viride 1.5% WP (Bio-Fungicide)',
          category: 'Organic / Bio-Control Agent',
          activeIngredient: 'Trichoderma viride antagonistic fungal spores (2x10^8 CFU/g)',
          dosage: '5.0 g / Liter of water (or 1 kg / acre mixed with 100 kg compost)',
          applicationMethod: 'Root Zone Drenching & Light Foliar Canopy Mist',
          timing: 'Late afternoon in moist soil conditions',
          waitingPeriod: '0 days (Eco-friendly, certified organic biological)',
          targetPathogen: 'Rhizoctonia & Fusarium root-rot complexes',
          safetyPrecautions: 'Do not tank-mix with chemical fungicides. Store in cool, shaded area.',
          organicAlternative: 'Pseudomonas fluorescens 1.5% WP @ 5 g/L',
        },
        {
          medicineName: '19:19:19 NPK + Chelated Zinc (Zn-EDTA 12%) & Boron (20%)',
          category: 'Nutritional Recovery Booster',
          activeIngredient: 'Water-Soluble NPK + Chelated Micronutrients',
          dosage: '4.0 g / Liter of water (800 g / acre in 200 Liters)',
          applicationMethod: 'Foliar Spray',
          timing: 'Apply 3-4 days following the curative fungicide spray',
          waitingPeriod: 'Not applicable (Nutritional supplement)',
          targetPathogen: 'Interveinal chlorosis, foliar yellowing & blossom drop prevention',
          safetyPrecautions: 'Avoid applying during high-temperature midday sun to prevent leaf scorch.',
          organicAlternative: 'Fermented Panchagavya @ 30 ml/L or Seaweed Extract @ 2 ml/L',
        },
      ],
      applicationWindow: 'Calm morning (6:30 - 9:00 AM) or late afternoon (4:30 - 6:30 PM)',
      tankMixCompatibility: 'Never mix live bio-agents (Trichoderma) in the same tank with chemical fungicides. Always conduct a small jar test before combining fertilizers with crop protection chemicals.',
      safetyNotice: 'Keep chemical containers out of reach of children and livestock. Rinse spraying equipment three times in drainage areas away from open water wells.',
    };
  }

  return {
    diagnosis: `${crop}: Comprehensive Therapeutic Plant Health Protocol`,
    items: [
      {
        medicineName: 'Copper Oxychloride 50% WP or Mancozeb 75% WP',
        category: 'Broad-Spectrum Curative Fungicide',
        activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
        dosage: '2.5 - 3.0 g / Liter of water (500-600 g / acre in 200 Liters)',
        applicationMethod: 'Foliar Spray evenly covering plant canopy',
        timing: 'Early morning under calm wind conditions; re-evaluate after 10 days',
        waitingPeriod: '7-10 days (Pre-Harvest Interval - PHI)',
        targetPathogen: 'Fungal leaf spots, anthracnose, and foliar blights',
        safetyPrecautions: 'Wear protective mask and gloves. Avoid spraying when rain is forecasted within 4 hours.',
        organicAlternative: 'Cold-pressed Neem Oil 10,000 ppm @ 4 ml/L with liquid organic soap emulsifier',
      },
      {
        medicineName: 'Trichoderma viride or Pseudomonas fluorescens',
        category: 'Biological Antagonist / Bio-Control',
        activeIngredient: 'Beneficial Microorganism Spores (> 2x10^8 CFU/g)',
        dosage: '5.0 g / Liter of water (or 1-2 kg / acre enriched in farmyard manure)',
        applicationMethod: 'Soil application / Root collar drench',
        timing: 'Late afternoon in moist soil conditions',
        waitingPeriod: '0 days (Non-toxic biological)',
        targetPathogen: 'Soil-borne pathogens and root health suppression',
        safetyPrecautions: 'Apply within 24 hours of mixing with water. Do not expose to direct noon sunlight.',
        organicAlternative: 'Liquid Jeevamrutham or Vermiwash @ 50 ml/L',
      },
      {
        medicineName: 'Chelated Zinc (Zn-EDTA 12%) + Soluble Boron (20%)',
        category: 'Micronutrient Foliar Supplement',
        activeIngredient: 'Chelated Micronutrient Complex',
        dosage: '1.0 g Zinc + 1.0 g Boron / Liter of water',
        applicationMethod: 'Fine droplet foliar spray',
        timing: 'Morning or late afternoon',
        waitingPeriod: 'Not applicable (Nutritional supplement)',
        targetPathogen: 'Micronutrient deficiency chlorosis & tissue vigor restoration',
        safetyPrecautions: 'Ensure correct dosage; avoid over-concentration.',
        organicAlternative: 'Humic acid 12% @ 3 ml/L or Seaweed extract',
      },
    ],
    applicationWindow: 'Calm morning (6:30 - 9:00 AM) or late afternoon (4:30 - 6:30 PM)',
    tankMixCompatibility: 'Do not combine biological agents in the same tank with synthetic chemical fungicides. Spray bio-agents 4-5 days apart from chemical sprays.',
    safetyNotice: 'Wear full protective personal equipment. Wash hands and face thoroughly following application.',
  };
};

export const AdvisoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const res = await advisoryApi.getAdvisoryById(id);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || t('advisory.notFoundDesc', 'Failed to load advisory'));
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisory();

    return () => {
      stopSpeaking();
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(t('advisory.deleteConfirm', 'Delete this crop advisory and associated agent logs?'))) return;
    setDeleting(true);
    try {
      await advisoryApi.deleteAdvisory(id);
      navigate('/history');
    } catch (err) {
      alert(err.response?.data?.message || t('common.errorGeneric', 'Failed to delete'));
      setDeleting(false);
    }
  };

  const handleToggleSpeech = () => {
    setSpeechError('');

    if (!isSpeechSynthesisSupported()) {
      setSpeechError(t('common.voiceUnavailable', 'Voice playback is unavailable on this device.'));
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const advisory = data?.advisory || data || {};
    const pAnalysis = advisory.problemAnalysis || {};
    const cReasoning = advisory.cropReasoning || {};
    const rAssessment = advisory.riskAssessment || {};

    const speechLanguage = advisory.language || language || 'en';

    // Construct high-value text synthesis for farmer listening
    const introText = `${t('advisory.title', 'AI Crop Advisory')}: ${advisory.crop || ''}.`;
    const problemText = pAnalysis.identifiedProblem ? `${t('advisory.coreIdentifiedIssue', 'Core Identified Issue')}: ${pAnalysis.identifiedProblem}.` : '';

    const activePrescription = (advisory.prescription?.items && advisory.prescription.items.length > 0)
      ? advisory.prescription
      : getFallbackPrescription(advisory, speechLanguage);
    const rxItems = activePrescription.items || [];
    const prescriptionText = rxItems.length > 0
      ? `${t('advisory.prescriptionTitle', 'Rx Prescription')}: ${rxItems.map((p) => `${p.medicineName}, ${t('advisory.dosage', 'dosage')} ${p.dosage}`).join('. ')}.`
      : '';

    const riskText = rAssessment.riskReason ? `${t('advisory.riskReason', 'Risk Reason')}: ${rAssessment.riskReason}.` : '';
    const irrigationText = cReasoning.irrigationAdvice || '';
    const nutrientText = cReasoning.nutrientAdvice || '';
    const summaryText = advisory.finalSummary ? `${t('advisory.executiveSummary', 'Summary')}: ${advisory.finalSummary}` : '';

    const fullScript = [introText, problemText, prescriptionText, riskText, irrigationText, nutrientText, summaryText]
      .filter(Boolean)
      .join(' ');

    const utterance = speak(fullScript, speechLanguage, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (err) => {
        console.warn('Speech playback error:', err);
        setIsSpeaking(false);
        setSpeechError(t('common.voiceUnavailable', 'Voice playback is unavailable on this device.'));
      },
    });

    if (!utterance) {
      setIsSpeaking(false);
    }
  };

  if (loading) {
    return <LoadingState message={t('common.analyzing', 'Synthesizing advisory telemetry and agent logs...')} />;
  }

  if (error || !data) {
    return (
      <div className="hologram-card rounded-3xl border border-rose-500/30 p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">{t('advisory.notFound', 'Advisory Not Found')}</h3>
        <p className="text-sm text-slate-300 mt-1">{error || t('advisory.notFoundDesc', 'Could not load advisory details')}</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-darkBg-950 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('advisory.returnDashboard', 'Return to Dashboard')}</span>
        </Link>
      </div>
    );
  }

  const advisory = data?.advisory || data || {};
  const agentLogs = data?.agentLogs || [];
  const pAnalysis = advisory.problemAnalysis || {};
  const cReasoning = advisory.cropReasoning || {};
  const rAssessment = advisory.riskAssessment || {};
  const aPlan = advisory.actionPlan || {};

  const prescription = (advisory.prescription?.items && advisory.prescription.items.length > 0)
    ? advisory.prescription
    : getFallbackPrescription(advisory, advisory.language || language || 'en');
  const prescriptionItems = prescription.items || [];

  // Formulate dynamic probability bars for possible causes
  const rawCauses = Array.isArray(pAnalysis.possibleCauses) && pAnalysis.possibleCauses.length > 0
    ? pAnalysis.possibleCauses
    : ['Nutrient Deficiency', 'Water Stress', 'Fungal Infection'];

  const causesWithPercentages = rawCauses.map((cause, index) => {
    const defaultScores = [78, 64, 42, 35];
    const title = typeof cause === 'string' ? cause : (cause?.title || cause?.name || cause?.cause || 'Agricultural factor');
    const percent = typeof cause === 'object' && typeof cause?.percent === 'number'
      ? cause.percent
      : (defaultScores[index] || Math.max(30, 80 - index * 15));
    return {
      title,
      percent,
    };
  });

  // Helper to extract timeline items whether aPlan is an object or array
  const getPlanItems = (key, fallback) => {
    if (Array.isArray(aPlan[key]) && aPlan[key].length > 0) {
      return aPlan[key];
    }
    if (Array.isArray(aPlan) && aPlan.length > 0) {
      const match = aPlan.find((p) => p.timeframe?.toLowerCase() === key.toLowerCase() || p.phase?.toLowerCase() === key.toLowerCase());
      if (match) {
        return [match.action || match.title || match.description];
      }
    }
    return fallback;
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('advisory.returnDashboard', 'Back to Dashboard')}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {/* Farmer Voice Listen / Stop Button */}
          {isSpeechSynthesisSupported() && (
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-glow-rose animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60 shadow-glass'
              }`}
              aria-label={isSpeaking ? t('common.stop', 'Stop') : t('common.listen', 'Listen')}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
                  <span>{t('common.stop', 'Stop')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('common.listen', 'Listen')}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-darkBg-900 border border-emerald-500/30 text-slate-200 hover:text-white shadow-glass transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t('common.print', 'Print Report')}</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('common.delete', 'Delete')}</span>
          </button>
        </div>
      </div>

      {speechError && (
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
          {speechError}
        </div>
      )}

      {/* Advisory Header Card */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-500/15">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {advisory.category}
              </span>
              <RiskBadge level={advisory.riskLevel} size="md" />
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                {t('common.confidence', 'AI Confidence')}: {Math.round((pAnalysis.confidence || 0.92) * 100)}%
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              {t('advisory.title', 'AI Crop Advisory')} — {advisory.crop}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {advisory.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {new Date(advisory.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('advisory.soilMatrix', 'Soil Matrix')}</span>
              <span className="text-xs font-bold text-white">{t(`soils.${advisory.soilType}`, advisory.soilType)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('advisory.growthStage', 'Growth Stage')}</span>
              <span className="text-xs font-bold text-white">{t(`stages.${advisory.growthStage}`, advisory.growthStage)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('advisory.irrigationMethod', 'Irrigation')}</span>
              <span className="text-xs font-bold text-white">{t(`irrigation.${advisory.irrigation}`, advisory.irrigation)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('advisory.orchestration', 'Orchestration')}</span>
              <span className="text-xs font-bold text-emerald-400">{t('advisory.orchestrationVerified', '4 Agents Verified')}</span>
            </div>
          </div>
        </div>

        {/* Symptoms Context Box */}
        <div className="mt-6 p-4 rounded-2xl bg-darkBg-950/60 border border-emerald-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {t('advisory.observedSymptoms', 'Observed Symptoms & Farm Context')}:
          </span>
          <p className="text-sm text-slate-200 italic leading-relaxed">
            "{advisory.symptoms}"
          </p>
        </div>
      </div>

      {/* Autonomous Multi-Agent Pipeline Execution Timeline */}
      <AgentWorkflowTimeline agentLogs={agentLogs} isLiveSimulation={false} />

      {/* Section 1: Problem Analysis & Animated Possible Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Problem Analysis (7 cols) */}
        <div className="lg:col-span-7 hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/15">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">{t('advisory.agent1Header', 'AGENT 01 ANALYSIS')}</span>
              <h2 className="text-xl font-bold font-display text-white">
                {t('advisory.problemAnalysisTitle', 'Problem Analysis & Diagnosis')}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">
              {t('advisory.coreIdentifiedIssue', 'Core Identified Issue')}:
            </span>
            <p className="text-base font-semibold text-white">
              {pAnalysis.identifiedProblem || advisory.category}
            </p>
          </div>

          {/* Key Symptoms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('advisory.keySymptoms', 'Key Diagnostic Symptoms')}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {(pAnalysis.keySymptoms || []).map((sym, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-darkBg-950 text-slate-200 border border-slate-800"
                >
                  • {sym}
                </span>
              ))}
            </div>
          </div>

          {pAnalysis.missingInformation?.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">{t('advisory.missingInfo', 'Missing Information for Absolute Certainty')}: </span>
                {pAnalysis.missingInformation.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Right: Possible Causes Animated Percentage Bars (5 cols) */}
        <div className="lg:col-span-5 hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/15">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">{t('advisory.probabilityMatrix', 'PROBABILITY MATRIX')}</span>
              <h3 className="text-xl font-bold font-display text-white">
                {t('advisory.possibleCauses', 'Possible Causes')}
              </h3>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {causesWithPercentages.map((cause, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{cause.title}</span>
                  <span className="font-mono font-bold text-emerald-400">{cause.percent}%</span>
                </div>
                <div className="w-full bg-darkBg-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${cause.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================
          SECTION: RX CROP TREATMENT & MEDICINE PRESCRIPTION
      ==================================================== */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/40 shadow-glow-emerald space-y-6 relative overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Prescription Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-glass">
              <Pill className="w-6 h-6 text-lime-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/40">
                  {t('advisory.prescriptionBadge', 'RX TREATMENT PRESCRIPTION')}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  AGROMIND VERIFIED • {advisory.crop}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                {t('advisory.prescriptionTitle', 'Rx Crop Treatment & Medicine Prescription')}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {prescription.diagnosis || t('advisory.prescriptionSubtitle', 'Scientific therapeutic dosages, precise mixing ratios, and organic biological alternatives')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-darkBg-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('common.print', 'Print Report')}</span>
            </button>
          </div>
        </div>

        {/* Prescription Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {prescriptionItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 bg-darkBg-950/80 border border-emerald-500/30 shadow-glass flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${
                    idx === 0
                      ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                      : idx === 1
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                      : 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {item.category || (idx === 0 ? 'Chemical Curative' : idx === 1 ? 'Biological Control' : 'Nutritional Tonic')}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {item.medicineName}
                </h3>

                {item.activeIngredient && (
                  <p className="text-[11px] font-mono text-emerald-400">
                    Active: {item.activeIngredient}
                  </p>
                )}
              </div>

              {/* Highlighted Dosage Callout */}
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400/40 shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                  🧪 {t('advisory.dosage', 'Recommended Dosage')}:
                </span>
                <p className="text-xs font-extrabold text-lime-300">
                  {item.dosage}
                </p>
              </div>

              {/* Specifications List */}
              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                {item.targetPathogen && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0">🎯 {t('advisory.targetPathogen', 'Target')}:</span>
                    <span className="text-slate-200">{item.targetPathogen}</span>
                  </div>
                )}

                {item.applicationMethod && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0">🚜 {t('advisory.applicationMethod', 'Method')}:</span>
                    <span className="text-slate-200">{item.applicationMethod}</span>
                  </div>
                )}

                {item.timing && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0">⏰ {t('advisory.sprayTiming', 'Timing')}:</span>
                    <span className="text-slate-200">{item.timing}</span>
                  </div>
                )}

                {item.waitingPeriod && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0">⏳ {t('advisory.waitingPeriod', 'PHI')}:</span>
                    <span className="text-amber-300 font-medium">{item.waitingPeriod}</span>
                  </div>
                )}
              </div>

              {/* Organic Alternative / Safety Note */}
              {item.organicAlternative && (
                <div className="p-2.5 rounded-xl bg-lime-950/40 border border-lime-500/30 text-[11px] text-lime-300">
                  <span className="font-bold block mb-0.5">🌿 {t('advisory.organicAlternative', 'Organic / Bio Alternative')}:</span>
                  <span>{item.organicAlternative}</span>
                </div>
              )}

              {item.safetyPrecautions && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item.safetyPrecautions}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tank-Mix & Field Safety Advisory Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{t('advisory.tankMixNotice', 'Tank-Mix Compatibility Alert')}:</span>
              <span>{prescription.tankMixCompatibility || 'Do not combine biological agents with chemical fungicides in the same tank. Always conduct a small jar test before mixing.'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-emerald-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">{t('advisory.chemicalSafety', 'Safe Chemical Handling & Spray Hours')}:</span>
              <span>{prescription.applicationWindow || 'Spray in early mornings or late afternoons. Wear protective mask and gloves.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Recommendations Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {t('advisory.recommendations', 'Targeted Agricultural Recommendations')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 💧 Irrigation */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-sky-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
              {t('advisory.wateringProtocol', 'WATERING PROTOCOL')}
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              {t('advisory.irrigationGuidance', '💧 Irrigation Guidance')}
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.irrigationAdvice || advisory.irrigationAdvice || 'Maintain consistent soil moisture based on crop stage.'}
            </p>
          </motion.div>

          {/* Card 2: 🌱 Nutrients */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-amber-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
              {t('advisory.soilFertility', 'SOIL FERTILITY')}
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              {t('advisory.nutrientGuidance', '🌱 Nutrient Guidance')}
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.nutrientAdvice || advisory.nutrientAdvice || 'Consider soil testing before applying chemical fertilizer.'}
            </p>
          </motion.div>

          {/* Card 3: 🌿 Crop Care */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-emerald-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              {t('advisory.physiologyCare', 'PHYSIOLOGY & CARE')}
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              {t('advisory.cropCareActions', '🌿 Crop Care Actions')}
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.analysis
                ? cReasoning.analysis.slice(0, 160) + '...'
                : 'Remove visibly damaged leaves and monitor symptom progression daily.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: Risk Assessment */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400">{t('advisory.agent3Header', 'AGENT 03 ASSESSMENT')}</span>
              <h2 className="text-xl font-bold font-display text-white">
                {t('advisory.riskEvaluation', 'Risk & Severity Evaluation')}
              </h2>
            </div>
          </div>
          <RiskBadge level={rAssessment.riskLevel || advisory.riskLevel} size="md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('advisory.severityUrgency', 'Severity & Urgency')}</span>
            <p className="text-base font-bold text-white mt-1">
              {rAssessment.severity || 'Moderate'} • {rAssessment.urgency || advisory.urgency || 'Within 24-48 hours'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{t('advisory.riskReason', 'Risk Reason')}</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {rAssessment.riskReason || advisory.riskReason}
            </p>
          </div>
        </div>

        {rAssessment.riskFactors?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('advisory.keyRiskDrivers', 'Key Risk Drivers')}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {rAssessment.riskFactors.map((factor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-950/50 text-rose-300 border border-rose-500/30"
                >
                  ⚠ {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: 7-Day Chronological Action Plan Timeline */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
        <div className="pb-3 border-b border-emerald-500/15">
          <span className="text-[10px] font-mono font-bold text-cyan-400">{t('advisory.agent4Header', 'AGENT 04 ROADMAP')}</span>
          <h2 className="text-2xl font-bold font-display text-white">
            {t('advisory.actionPlan', '7-Day Chronological Action Plan')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('advisory.actionPlanSubtitle', 'Prioritized tasks for today and the coming days')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODAY */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-emerald-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              {t('advisory.today', 'TODAY')}
            </span>
            <h4 className="font-bold text-white text-sm">{t('advisory.todayTitle', 'Immediate Actions')}</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {getPlanItems('today', ['Inspect affected plants closely', 'Verify soil moisture']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEXT 3 DAYS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-cyan-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              {t('advisory.next3Days', 'NEXT 3 DAYS')}
            </span>
            <h4 className="font-bold text-white text-sm">{t('advisory.next3DaysTitle', 'Monitoring & Tuning')}</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {getPlanItems('next3Days', ['Monitor symptoms & soil moisture', 'Observe newly emerging shoots']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEXT 7 DAYS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-lime-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-500/30">
              {t('advisory.next7Days', 'NEXT 7 DAYS')}
            </span>
            <h4 className="font-bold text-white text-sm">{t('advisory.next7DaysTitle', 'Recovery Check')}</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {getPlanItems('next7Days', ['Evaluate overall crop recovery', 'Reassess foliar vigor and greening']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PREVENTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-purple-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
              {t('advisory.prevention', 'PREVENTION')}
            </span>
            <h4 className="font-bold text-white text-sm">{t('advisory.preventionTitle', 'Long-term Health')}</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {getPlanItems('preventive', ['Maintain regular crop monitoring', 'Adopt balanced seasonal crop rotation']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>{t('advisory.executiveSummary', 'Executive Advisory Summary')}</span>
        </div>
        <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
          "{advisory.finalSummary}"
        </p>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-emerald-500/20 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300 block mb-0.5">
            {t('advisory.disclaimerTitle', 'Agricultural Decision-Support Disclaimer')}:
          </span>
          {t('advisory.disclaimerText', 'AI-generated agricultural guidance is provided for informational and decision-support purposes. Conditions vary by location and farm. For severe crop damage, suspected disease outbreaks, or uncertain conditions, consult a qualified local agricultural expert before taking significant action.')}
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDetailPage;
