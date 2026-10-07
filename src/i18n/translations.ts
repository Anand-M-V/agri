export type AppLanguage = 'en' | 'kn';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tabs: {
    map: string;
    mandi: string;
    agronomy: string;
    cadastral: string;
    weather: string;
  };
  rtk: {
    fixStatus: string;
    satellites: string;
    accuracyH: string;
    accuracyV: string;
    corsBase: string;
    cadenceTracking: string;
    battery: string;
    utmZone: string;
    msl: string;
    gridCoords: string;
  };
  actions: {
    startSurvey: string;
    logGpsVertex: string;
    backToGis: string;
    startBoundaryWalk: string;
    stopBoundaryWalk: string;
    undo: string;
    clear: string;
    saveParcel: string;
    cancel: string;
    listHarvestLot: string;
    placeYardBid: string;
    viewCertificate: string;
    downloadGeoJson: string;
    inspectOnMap: string;
    printDocument: string;
    close: string;
    confirmBid: string;
    directDial: string;
    triggerDrip: string;
    dripInProgress: string;
  };
  units: {
    acres: string;
    hectares: string;
    bigha: string;
    guntha: string;
    biswa: string;
    cent: string;
    sq_meters: string;
    sq_yards: string;
    boundaryPerimeter: string;
    simultaneousConversions: string;
    clickToSetPrimary: string;
    activePolygon: string;
  };
  mapLayers: {
    ortho: string;
    ndvi: string;
    elevation: string;
    cadastral: string;
  };
  mandi: {
    badge: string;
    sessionActive: string;
    title: string;
    subtitle: string;
    selectYard: string;
    tabRates: string;
    tabOrderBook: string;
    tabAgents: string;
    searchPlaceholder: string;
    arrivalsToday: string;
    moistureTest: string;
    tradingVolume: string;
    matchingLive: string;
    qualityCertTitle: string;
    qualityCertDesc: string;
  };
  agronomy: {
    badge: string;
    title: string;
    assignedPlot: string;
    microclimateTitle: string;
    solarIrradiance: string;
    vpdDeficit: string;
    canopyTemp: string;
    referenceEt: string;
    wind: string;
    rh: string;
    soilStrataTitle: string;
    depthSelector: string;
    volumetricMoisture: string;
    soilPh: string;
    soilEc: string;
    advisoryTitle: string;
    optimalMoisture: string;
    nextRecommended: string;
    recommendedPulse: string;
    waterVolume: string;
    diurnalTitle: string;
  };
  cadastral: {
    badge: string;
    title: string;
    subtitle: string;
    verifiedParcels: string;
    khasra: string;
    rtkVerified: string;
    surveyedArea: string;
    perimeterLength: string;
    recordedOwner: string;
    surveyorStamp: string;
    certHeader: string;
    certTitle: string;
    jurisdiction: string;
    controlPoints: string;
    digitalSeal: string;
    verifiedBy: string;
  };
  modals: {
    createLotTitle: string;
    createLotSubtitle: string;
    newPlotTitle: string;
    newPlotSubtitle: string;
    agentDeskTitle: string;
    agentDeskSubtitle: string;
    yardBidTitle: string;
  };
  weather: {
    badge: string;
    title: string;
    subtitle: string;
    selectDate: string;
    selectTime: string;
    timelineTitle: string;
    radarTitle: string;
    radarSubtitle: string;
    rainProbability: string;
    expectedRainfall: string;
    peakWindow: string;
    sprayAdvisory: string;
    irrigationAdvisory: string;
    cloudCover: string;
    dewPoint: string;
    pressure: string;
    spraySafe: string;
    sprayWarning: string;
    sprayProhibited: string;
    irrigationNormal: string;
    irrigationSuspend: string;
    intensities: {
      none: string;
      drizzle: string;
      moderate: string;
      heavy: string;
      storm: string;
    };
  };
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    appName: 'AgroTelemetry Precision',
    appSubtitle: 'Biophilic GIS Survey & APMC Mandi Telemetry',
    tabs: {
      map: 'Field GIS Console',
      mandi: 'Mandi Commodity Exchange',
      agronomy: 'Agronomic Station',
      cadastral: 'Cadastral Vault',
      weather: 'Rain & Weather Radar',
    },
    rtk: {
      fixStatus: 'RTK FIX',
      satellites: 'SVs (GPS+GAL+GLO+BDS)',
      accuracyH: 'H: ±0.018m',
      accuracyV: 'V: ±0.031m',
      corsBase: 'CORS Base: 1.4 km',
      cadenceTracking: 'CADENCE TRACKING',
      battery: '12V LiFePO4',
      utmZone: 'UTM 43N',
      msl: 'm MSL',
      gridCoords: 'GRID COORD',
    },
    actions: {
      startSurvey: 'Start Survey',
      logGpsVertex: 'Log GPS Vertex',
      backToGis: 'Back to GIS Console',
      startBoundaryWalk: 'Simulate Perimeter Walk',
      stopBoundaryWalk: 'Stop Boundary Walk',
      undo: 'Undo',
      clear: 'Clear',
      saveParcel: 'Save Parcel Record',
      cancel: 'Cancel',
      listHarvestLot: 'List Certified Harvest Lot',
      placeYardBid: 'Place Yard Bid',
      viewCertificate: 'View Certificate',
      downloadGeoJson: 'Download GeoJSON',
      inspectOnMap: 'Inspect on GIS Map',
      printDocument: 'Print Document',
      close: 'Close',
      confirmBid: 'Confirm Yard Bid',
      directDial: 'Direct Dial APMC Trader Line',
      triggerDrip: 'Trigger 45m Drip Pulse',
      dripInProgress: 'Pulse Irrigation In Progress...',
    },
    units: {
      acres: 'Acres',
      hectares: 'Hectares',
      bigha: 'Bigha',
      guntha: 'Guntha',
      biswa: 'Biswa',
      cent: 'Cent',
      sq_meters: 'Square Meters',
      sq_yards: 'Square Yards',
      boundaryPerimeter: 'Boundary Perimeter',
      simultaneousConversions: 'SIMULTANEOUS REGIONAL CONVERSIONS:',
      clickToSetPrimary: 'Click unit to set primary',
      activePolygon: 'Active Measured Polygon',
    },
    mapLayers: {
      ortho: 'Orthomosaic',
      ndvi: 'NDVI Vigor',
      elevation: 'Elevation GIS',
      cadastral: 'Khasra Grid',
    },
    mandi: {
      badge: 'LIVE APMC WHOLESALE AUCTION YARD',
      sessionActive: 'Session Active (09:00 - 17:00 IST)',
      title: 'APMC Commodity Rate Telemetry',
      subtitle: 'Live settlement rates, daily arrival volumes in Metric Tonnes (MT), and verified trade bids.',
      selectYard: 'SELECT APMC YARD:',
      tabRates: 'Live Commodity Rates',
      tabOrderBook: 'Dynamic Order Book',
      tabAgents: 'Licensed Commission Agents',
      searchPlaceholder: 'Search wheat, soybean, grade...',
      arrivalsToday: 'Arrivals Today:',
      moistureTest: 'Avg Moisture Test:',
      tradingVolume: 'Trading Volume:',
      matchingLive: 'Matching Engine Live',
      qualityCertTitle: 'Certified Grade-A Moisture & Physical Assay',
      qualityCertDesc: 'All harvest lots registered through AgroTelemetry Precision carry automated RTK Cadastral plot origin tags, digital NIR moisture assay readings, and seed variety verification.',
    },
    agronomy: {
      badge: 'TELEMETRY PROBE ACTIVE (PING 3s)',
      title: 'RTK Field Telemetry Station Alpha-01',
      assignedPlot: 'Assigned to North Khasra 142/2 (Sharbati Wheat C-306) · Solar Pod 12V LiFePO4 (94%)',
      microclimateTitle: 'ATMOSPHERIC MICROCLIMATE',
      solarIrradiance: 'Solar Irradiance',
      vpdDeficit: 'VPD Deficit',
      canopyTemp: 'Canopy Temp',
      referenceEt: 'Reference ET₀',
      wind: 'Wind',
      rh: 'RH',
      soilStrataTitle: 'SOIL HORIZON STRATA TELEMETRY',
      depthSelector: 'Depth',
      volumetricMoisture: 'Volumetric Moisture (VWC):',
      soilPh: 'SOIL pH',
      soilEc: 'SALINITY (EC)',
      advisoryTitle: 'IRRIGATION ADVISORY CALCULATION',
      optimalMoisture: 'Optimal Moisture Balance',
      nextRecommended: 'Next Recommended Drip:',
      recommendedPulse: 'Recommended Pulse:',
      waterVolume: 'Calculated Water Volume:',
      diurnalTitle: '24-Hour Diurnal Soil Moisture & Vapor Pressure Deficit (VPD)',
    },
    cadastral: {
      badge: 'DIGITAL CADASTRAL SURVEY VAULT',
      title: 'Land Records & Surveyor Certifications',
      subtitle: 'Verified legal boundaries, revenue department Khasra registers, and cryptographic survey stamps.',
      verifiedParcels: 'Verified Cadastral Parcels',
      khasra: 'KHASRA',
      rtkVerified: 'RTK VERIFIED',
      surveyedArea: 'Surveyed Area:',
      perimeterLength: 'Perimeter Length:',
      recordedOwner: 'Recorded Owner:',
      surveyorStamp: 'Surveyor Stamp:',
      certHeader: 'OFFICIAL CADASTRAL SURVEY RECORD',
      certTitle: 'Certificate of Geodetic Land Demarcation',
      jurisdiction: 'PARCEL REVENUE JURISDICTION',
      controlPoints: 'Boundary Control Points (WGS-84 & UTM Zone 43N)',
      digitalSeal: 'DIGITAL RECORD HASH SEAL',
      verifiedBy: 'Verified by:',
    },
    modals: {
      createLotTitle: 'List Certified Harvest Lot',
      createLotSubtitle: 'Attach georeferenced cadastral plot origin and verified laboratory moisture assay.',
      newPlotTitle: 'Save Geodetic Field Parcel',
      newPlotSubtitle: 'Register new cadastral boundary parcel in the local revenue registry.',
      agentDeskTitle: 'APMC Verified Arhtiya Commission Desk',
      agentDeskSubtitle: 'Direct contact with verified commission agent.',
      yardBidTitle: 'Instant APMC Yard Bid Placement',
    },
    weather: {
      badge: 'PRECISION DOPPLER RAIN RADAR & SATELLITE TELEMETRY',
      title: 'Field Rain Prediction & Weather Telemetry',
      subtitle: 'Hour-by-hour precipitation probability, volume in mm, Doppler reflectivity, and agronomic spray window.',
      selectDate: 'Select Forecast Date:',
      selectTime: 'Hourly Telemetry Time:',
      timelineTitle: 'Hour-by-Hour Rain Probability Timeline',
      radarTitle: 'Live Doppler Precipitation Radar Scan',
      radarSubtitle: 'Real-time radar reflectivity scan over farm parcels',
      rainProbability: 'Rain Probability (PoP)',
      expectedRainfall: 'Expected Volume',
      peakWindow: 'Predicted Rain Window',
      sprayAdvisory: 'Pesticide Spray Advisory',
      irrigationAdvisory: 'Irrigation Action',
      cloudCover: 'Cloud Cover',
      dewPoint: 'Dew Point',
      pressure: 'Atmospheric Pressure',
      spraySafe: 'SAFE TO SPRAY (Zero wash risk)',
      sprayWarning: 'SPRAY WITH CAUTION (Moderate risk)',
      sprayProhibited: 'DO NOT SPRAY (Rain washes chemicals)',
      irrigationNormal: 'Run Drip Cycle Normally',
      irrigationSuspend: 'Automated Irrigation Pause (Rain Expected)',
      intensities: {
        none: 'No Rain',
        drizzle: 'Light Drizzle',
        moderate: 'Moderate Showers',
        heavy: 'Heavy Downpour',
        storm: 'Severe Thunderstorm',
      },
    },
  },
  kn: {
    appName: 'ಅಗ್ರೋಟೆಲಿಮೆಟ್ರಿ ನಿಖರತೆ',
    appSubtitle: 'ನಿಖರ ಜಿಐಎಸ್ ಜಮೀನು ಸಮೀಕ್ಷೆ ಮತ್ತು ಎಪಿಎಂಸಿ ಮಂಡಿ ಟೆಲಿಮೆಟ್ರಿ',
    tabs: {
      map: 'ಜಮೀನು ಜಿಐಎಸ್ ಕನ್ಸೋಲ್',
      mandi: 'ಮಂಡಿ ಸರಕು ಮಾರುಕಟ್ಟೆ',
      agronomy: 'ಕೃಷಿ ಸಂವೇದಕ ಕೇಂದ್ರ',
      cadastral: 'ಕಂದಾಯ ಸರ್ವೆ ಖಜಾನೆ',
      weather: 'ಮಳೆ & ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    },
    rtk: {
      fixStatus: 'ಆರ್‌ಟಿಕೆ ಲಾಕ್',
      satellites: 'ಉಪಗ್ರಹಗಳು (GPS+GAL+GLO+BDS)',
      accuracyH: 'ಅಡ್ಡಲಾಗಿ: ±0.018ಮೀ',
      accuracyV: 'ಲಂಬವಾಗಿ: ±0.031ಮೀ',
      corsBase: 'CORS ಕೇಂದ್ರ: 1.4 ಕಿ.ಮೀ',
      cadenceTracking: 'ಗಡಿ ನಡಿಗೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಕ್ರಿಯ',
      battery: '12V ಲಿಥಿಯಂ',
      utmZone: 'ಯುಟಿಎಂ 43N',
      msl: 'ಮೀಟರ್ ಸಮುದ್ರ ಮಟ್ಟ',
      gridCoords: 'ಗ್ರಿಡ್ ನಿರ್ದೇಶಾಂಕ',
    },
    actions: {
      startSurvey: 'ಸಮೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ',
      logGpsVertex: 'ಜಿಪಿಎಸ್ ಶೃಂಗ ದಾಖಲಿಸಿ',
      backToGis: 'ಜಿಐಎಸ್ ಕನ್ಸೋಲ್‌ಗೆ ಹಿಂತಿರುಗಿ',
      startBoundaryWalk: 'ಗಡಿ ನಡಿಗೆ ಅನುಕರಣೆ',
      stopBoundaryWalk: 'ನಡಿಗೆ ನಿಲ್ಲಿಸಿ',
      undo: 'ಹಿಂದಕ್ಕೆ (Undo)',
      clear: 'ತೆರವುಗೊಳಿಸಿ',
      saveParcel: 'ಜಮೀನು ದಾಖಲೆ ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಗೊಳಿಸಿ',
      listHarvestLot: 'ಬೆಳೆ ಹರಾಜು ಪಟ್ಟಿ ಮಾಡಿ',
      placeYardBid: 'ಮಂಡಿ ಬಿಡ್ ಸಲ್ಲಿಸಿ',
      viewCertificate: 'ಪ್ರಮಾಣಪತ್ರ ವೀಕ್ಷಿಸಿ',
      downloadGeoJson: 'ಜಿಯೋಜೆಸನ್ ಡೌನ್‌ಲೋಡ್',
      inspectOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ',
      printDocument: 'ಮುದ್ರಿಸಿ (Print)',
      close: 'ಮುಚ್ಚಿ',
      confirmBid: 'ಬಿಡ್ ಖಚಿತಪಡಿಸಿ',
      directDial: 'ದಲ್ಲಾಳಿಗಳಿಗೆ ನೇರ ಕರೆ ಮಾಡಿ',
      triggerDrip: '೪೫ ನಿಮಿಷ ಹನಿ ನೀರಾವರಿ ಪ್ರಾರಂಭಿಸಿ',
      dripInProgress: 'ಹನಿ ನೀರಾವರಿ ಚಾಲ್ತಿಯಲ್ಲಿದೆ...',
    },
    units: {
      acres: 'ಎಕರೆ',
      hectares: 'ಹೆಕ್ಟೇರ್',
      bigha: 'ಬಿಘಾ',
      guntha: 'ಗುಂಟೆ',
      biswa: 'ಬಿಸ್ವಾ',
      cent: 'ಸೆಂಟ್',
      sq_meters: 'ಚದರ ಮೀಟರ್',
      sq_yards: 'ಚದರ ಗಜ',
      boundaryPerimeter: 'ಗಡಿ ಸುತ್ತಳತೆ',
      simultaneousConversions: 'ಪ್ರಾದೇಶಿಕ ಪರಿವರ್ತನೆಗಳು (ಕರ್ನಾಟಕ & ರಾಷ್ಟ್ರೀಯ):',
      clickToSetPrimary: 'ಮುಖ್ಯ ಘಟಕವಾಗಿ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
      activePolygon: 'ಅಳತೆ ಮಾಡಿದ ಜಮೀನು',
    },
    mapLayers: {
      ortho: 'ಉಪಗ್ರಹ ನಕ್ಷೆ',
      ndvi: 'ಎನ್‌ಡಿವಿಐ ಬೆಳೆ ಆರೋಗ್ಯ',
      elevation: 'ಎತ್ತರ ಮಟ್ಟ (GIS)',
      cadastral: 'ಸರ್ವೆ ನಂಬರ್ ಗ್ರಿಡ್',
    },
    mandi: {
      badge: 'ಲೈವ್ ಎಪಿಎಂಸಿ ಸಗಟು ಹರಾಜು ಮಾರುಕಟ್ಟೆ',
      sessionActive: 'ವ್ಯಾಪಾರ ಸಕ್ರಿಯವಾಗಿದೆ (09:00 - 17:00 IST)',
      title: 'ಎಪಿಎಂಸಿ ಬೆಳೆ ದರ ಟೆಲಿಮೆಟ್ರಿ',
      subtitle: 'ಪ್ರತಿದಿನದ ಬೆಳೆ ದರಗಳು, ಮೆಟ್ರಿಕ್ ಟನ್‌ಗಳಲ್ಲಿ ಆವಕ ಮತ್ತು ಪರಿಶೀಲಿತ ವ್ಯಾಪಾರಿ ಬಿಡ್‌ಗಳು.',
      selectYard: 'ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಆರಿಸಿ:',
      tabRates: 'ಲೈವ್ ಬೆಳೆ ದರಗಳು',
      tabOrderBook: 'ಲೈವ್ ಆರ್ಡರ್ ಬುಕ್',
      tabAgents: 'ಪರವಾನಗಿ ಪಡೆದ ದಲ್ಲಾಳಿಗಳು',
      searchPlaceholder: 'ಗೋಧಿ, ಸೋಯಾಬೀನ್, ಹತ್ತಿ ಹುಡುಕಿ...',
      arrivalsToday: 'ಇಂದಿನ ಆವಕ:',
      moistureTest: 'ಸರಾಸರಿ ತೇವಾಂಶ:',
      tradingVolume: 'ವ್ಯಾಪಾರ ಪ್ರಮಾಣ:',
      matchingLive: 'ಆರ್ಡರ್ ಮ್ಯಾಚಿಂಗ್ ಎಂಜಿನ್ ಲೈವ್',
      qualityCertTitle: 'ದರ್ಜೆ-ಎ ತೇವಾಂಶ ಮತ್ತು ಭೌತಿಕ ಗುಣಮಟ್ಟ ಖಾತರಿ',
      qualityCertDesc: 'ಅಗ್ರೋಟೆಲಿಮೆಟ್ರಿ ಮೂಲಕ ನೋಂದಾಯಿಸಲಾದ ಎಲ್ಲಾ ಬೆಳೆ ಲಾಟ್‌ಗಳು ಅಧಿಕೃತ ಆರ್‌ಟಿಕೆ ಸರ್ವೆ ನಂಬರ್ ಟ್ಯಾಗ್ ಮತ್ತು ಡಿಜಿಟಲ್ ತೇವಾಂಶ ಪರೀಕ್ಷಾ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಹೊಂದಿರುತ್ತವೆ.',
    },
    agronomy: {
      badge: 'ಟೆಲಿಮೆಟ್ರಿ ಸಂವೇದಕ ಸಕ್ರಿಯ (ಪ್ರತಿ 3 ಸೆ)',
      title: 'ಆರ್‌ಟಿಕೆ ಕೃಷಿ ಸಂವೇದಕ ಕೇಂದ್ರ ಆಲ್ಫಾ-೦೧',
      assignedPlot: 'ಸರ್ವೆ ನಂ. 142/2 (ಶರಬತಿ ಗೋಧಿ) ಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ · ಸೋಲಾರ್ ಬ್ಯಾಟರಿ 94%',
      microclimateTitle: 'ವಾತಾವರಣ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಹವಾಮಾನ',
      solarIrradiance: 'ಸೌರ ವಿಕಿರಣ',
      vpdDeficit: 'ವಿಪಿಡಿ ಕೊರತೆ',
      canopyTemp: 'ಬೆಳೆ ತಾಪಮಾನ',
      referenceEt: 'ಉತ್ಸರ್ಜನ ಪ್ರಮಾಣ ET₀',
      wind: 'ಗಾಳಿ',
      rh: 'ಆರ್ದ್ರತೆ RH',
      soilStrataTitle: 'ಮಣ್ಣಿನ ವಿವಿಧ ಆಳದ ತೇವಾಂಶ ವಿವರ',
      depthSelector: 'ಆಳ',
      volumetricMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ (VWC):',
      soilPh: 'ಮಣ್ಣಿನ ಪಿಎಚ್ (pH)',
      soilEc: 'ಲವಣಾಂಶ (EC)',
      advisoryTitle: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಲಹಾ ಗಣನೆ',
      optimalMoisture: 'ಸೂಕ್ತ ತೇವಾಂಶ ಸಮತೋಲನ',
      nextRecommended: 'ಮುಂದಿನ ಶಿಫಾರಸು ಮಾಡಿದ ನೀರಾವರಿ:',
      recommendedPulse: 'ಶಿಫಾರಸು ಮಾಡಿದ ಅವಧಿ:',
      waterVolume: 'ಅಂದಾಜು ನೀರಿನ ಪ್ರಮಾಣ:',
      diurnalTitle: '೨೪ ಗಂಟೆಗಳ ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಆವಿ ಒತ್ತಡದ ಕೊರತೆ (VPD)',
    },
    cadastral: {
      badge: 'ಡಿಜಿಟಲ್ ಕಂದಾಯ ಸರ್ವೆ ಖಜಾನೆ',
      title: 'ಜಮೀನು ದಾಖಲೆಗಳು ಮತ್ತು ಸರ್ವೆ ಪ್ರಮಾಣಪತ್ರಗಳು',
      subtitle: 'ಕಾನೂನುಬದ್ಧ ಗಡಿ ಗುರುತುಗಳು, ಸರ್ವೆ ನಂಬರ್ ರಿಜಿಸ್ಟರ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಮುದ್ರೆ.',
      verifiedParcels: 'ಪರಿಶೀಲಿತ ಜಮೀನುಗಳು',
      khasra: 'ಸರ್ವೆ ನಂ.',
      rtkVerified: 'ಆರ್‌ಟಿಕೆ ದೃಢೀಕೃತ',
      surveyedArea: 'ಸಮೀಕ್ಷೆ ಮಾಡಿದ ವಿಸ್ತೀರ್ಣ:',
      perimeterLength: 'ಗಡಿ ಸುತ್ತಳತೆ:',
      recordedOwner: 'ದಾಖಲಿತ ಮಾಲೀಕರು:',
      surveyorStamp: 'ಸರ್ವೇಯರ್ ಲೈಸೆನ್ಸ್:',
      certHeader: 'ಅಧಿಕೃತ ಕಂದಾಯ ಸರ್ವೆ ದಾಖಲೆ',
      certTitle: 'ಜಮೀನು ಗಡಿ ಗುರುತಿಸುವಿಕೆ ಪ್ರಮಾಣಪತ್ರ',
      jurisdiction: 'ಕಂದಾಯ ವ್ಯಾಪ್ತಿ ವಿವರಗಳು',
      controlPoints: 'ಗಡಿ ನಿಯಂತ್ರಣ ಬಿಂದುಗಳು (WGS-84 & UTM Zone 43N)',
      digitalSeal: 'ಡಿಜಿಟಲ್ ಭದ್ರತಾ ಮುದ್ರೆ (Hash)',
      verifiedBy: 'ಪರಿಶೀಲಿಸಿದವರು:',
    },
    modals: {
      createLotTitle: 'ಪ್ರಮಾಣೀಕೃತ ಬೆಳೆ ಹರಾಜು ಪಟ್ಟಿ ಮಾಡಿ',
      createLotSubtitle: 'ಸರ್ವೆ ನಂಬರ್ ಜಮೀನು ಮೂಲ ಮತ್ತು ಡಿಜಿಟಲ್ ತೇವಾಂಶ ಪರೀಕ್ಷಾ ವರದಿಯನ್ನು ಲಗತ್ತಿಸಿ.',
      newPlotTitle: 'ಹೊಸ ಜಮೀನು ದಾಖಲಿಸಿ',
      newPlotSubtitle: 'ಕಂದಾಯ ರಿಜಿಸ್ಟರ್‌ನಲ್ಲಿ ಹೊಸ ಸರ್ವೆ ನಂಬರ್ ಗಡಿಗಳನ್ನು ದಾಖಲಿಸಿ.',
      agentDeskTitle: 'ಎಪಿಎಂಸಿ ಪರಿಶೀಲಿತ ಆಡತಿ/ದಲ್ಲಾಳಿ ಕಚೇರಿ',
      agentDeskSubtitle: 'ಪರವಾನಗಿ ಪಡೆದ ವ್ಯಾಪಾರಿಯೊಂದಿಗೆ ನೇರ ಸಂಭಾಷಣೆ.',
      yardBidTitle: 'ತಕ್ಷಣದ ಎಪಿಎಂಸಿ ಮಂಡಿ ಬಿಡ್ ಸಲ್ಲಿಕೆ',
    },
    weather: {
      badge: 'ನಿಖರ ಡಾಪ್ಲರ್ ಮಳೆ ರೇಡಾರ್ ಮತ್ತು ಉಪಗ್ರಹ ಟೆಲಿಮೆಟ್ರಿ',
      title: 'ಜಮೀನು ಮಟ್ಟದ ಮಳೆ ಮುನ್ಸೂಚನೆ & ಹವಾಮಾನ ವರದಿ',
      subtitle: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯವಾರು ಮಳೆ ಸಾಧ್ಯತೆ, ಮಿ.ಮೀ ಮಳೆ ಪ್ರಮಾಣ, ಡಾಪ್ಲರ್ ರೇಡಾರ್ ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಸಲಹೆ.',
      selectDate: 'ಮುನ್ಸೂಚನೆ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ:',
      selectTime: 'ಸಮಯವಾರು ಟೆಲಿಮೆಟ್ರಿ:',
      timelineTitle: 'ಗಂಟೆವಾರು ಮಳೆ ಸಂಭವನೀಯತೆ ಟೈಮ್‌ಲೈನ್',
      radarTitle: 'ಲೈವ್ ಡಾಪ್ಲರ್ ಮಳೆ ಮೋಡಗಳ ರೇಡಾರ್ ಸ್ಕ್ಯಾನ್',
      radarSubtitle: 'ಜಮೀನುಗಳ ಮೇಲೆ ಮಳೆ ಮೋಡಗಳ ಲೈವ್ ಚಲನವಲನ',
      rainProbability: 'ಮಳೆ ಸಂಭವನೀಯತೆ (PoP)',
      expectedRainfall: 'ಅಂದಾಜು ಮಳೆ ಪ್ರಮಾಣ',
      peakWindow: 'ಮಳೆ ಸುರಿಯುವ ನಿರೀಕ್ಷಿತ ಅವಧಿ',
      sprayAdvisory: 'ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಸಲಹೆ',
      irrigationAdvisory: 'ನೀರಾವರಿ ನಿರ್ಧಾರ',
      cloudCover: 'ಮೋಡ ಕವಿದ ಪ್ರಮಾಣ',
      dewPoint: 'ಇಬ್ಬನಿ ಬಿಂದು',
      pressure: 'ವಾತಾವರಣದ ಒತ್ತಡ',
      spraySafe: 'ಸಿಂಪಡಣೆಗೆ ಸುರಕ್ಷಿತ (ಮಳೆ ತೊಳೆದುಹೋಗುವ ಅಪಾಯವಿಲ್ಲ)',
      sprayWarning: 'ಎಚ್ಚರಿಕೆಯಿಂದ ಸಿಂಪಡಿಸಿ (ಸಾಧಾರಣ ಮಳೆ ಸಾಧ್ಯತೆ)',
      sprayProhibited: 'ಸಿಂಪಡಿಸಬೇಡಿ! (ಮಳೆಗೆ ಔಷಧ ತೊಳೆದು ವ್ಯರ್ಥವಾಗುತ್ತದೆ)',
      irrigationNormal: 'ಸಾಮಾನ್ಯ ಹನಿ ನೀರಾವರಿ ಚಲಾಯಿಸಿ',
      irrigationSuspend: 'ನೀರಾವರಿ ಸ್ವಯಂ-ಸ್ಥಗಿತ (ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ)',
      intensities: {
        none: 'ಮಳೆಯಿಲ್ಲ',
        drizzle: 'ತುಂತುರು ಮಳೆ',
        moderate: 'ಸಾಧಾರಣ ಮಳೆ',
        heavy: 'ಭಾರಿ ಮಳೆ',
        storm: 'ಗುಡುಗು ಸಹಿತ ಬಿರುಗಾಳಿ ಮಳೆ',
      },
    },
  },
};
