import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AlertTriangle, FileX, Download, Search, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import AI Vehicle Assets
import busImg from '../assets/vehicles/bus.png';
import minibusImg from '../assets/vehicles/minibus.png';
import taxiImg from '../assets/vehicles/taxi.png';
import vanImg from '../assets/vehicles/van.png';

// Import AI Staff Assets
import portrait1 from '../assets/staff/portrait_1.png';
import portrait2 from '../assets/staff/portrait_2.png';

const VEHICLE_IMAGES = {
  'bus': busImg,
  'minibus': minibusImg,
  'taxi': taxiImg,
  'van': vanImg,
  'default': busImg
};

const STAFF_PORTRAITS = [portrait1, portrait2];

// Fix leaflet icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/* ── MOCK DATA POUR LES COORDONNÉES DES LIGNES (Dakar & Alentours) ── */
const CITIES = {
  'Dakar': [14.6728, -17.4333],
  'Pikine': [14.7683, -17.3986],
  'Rufisque': [14.7167, -17.2833],
  'Thies': [14.7925, -16.9281],
  'Mbour': [14.4172, -16.9634]
};

const LIGNES_MAP_DATA = {
  'L01': { nom: 'Dakar - Pikine', color: '#4dabf7', path: [[14.662761,-17.43748],[14.663496,-17.4373],[14.664441,-17.43698],[14.666337,-17.43701],[14.667615,-17.43714],[14.668272,-17.43721],[14.669013,-17.43727],[14.669704,-17.43732],[14.670364,-17.43734],[14.670934,-17.43736],[14.671535,-17.43739],[14.672175,-17.4374],[14.673166,-17.43744],[14.674083,-17.43747],[14.674718,-17.43748],[14.675358,-17.4375],[14.6762,-17.43752],[14.677019,-17.43755],[14.677226,-17.43756],[14.677909,-17.43757],[14.678773,-17.43758],[14.679497,-17.43766],[14.679792,-17.43768],[14.68046,-17.4383],[14.683534,-17.44044],[14.683761,-17.44058],[14.684124,-17.44074],[14.684413,-17.44084],[14.684667,-17.44095],[14.685233,-17.44101],[14.685561,-17.44113],[14.686074,-17.44136],[14.686323,-17.44142],[14.687345,-17.44167],[14.688137,-17.44187],[14.688778,-17.44203],[14.689274,-17.44216],[14.689567,-17.44223],[14.690414,-17.44243],[14.690635,-17.44247],[14.691107,-17.44255],[14.691302,-17.44257],[14.691445,-17.44258],[14.691606,-17.44259],[14.691801,-17.44259],[14.693798,-17.44247],[14.695026,-17.44237],[14.699124,-17.44213],[14.700093,-17.44207],[14.711954,-17.44128],[14.719258,-17.44078],[14.719884,-17.44073],[14.721214,-17.44064],[14.722602,-17.44054],[14.723052,-17.44052],[14.723472,-17.44049],[14.724774,-17.44042],[14.725076,-17.4404],[14.725581,-17.44038],[14.726096,-17.44035],[14.726303,-17.44033],[14.726544,-17.44032],[14.728509,-17.44018],[14.731519,-17.44],[14.733682,-17.43985],[14.735612,-17.43971],[14.736025,-17.43969],[14.736387,-17.43962],[14.736532,-17.43959],[14.736651,-17.43956],[14.736917,-17.4395],[14.737244,-17.43941],[14.737462,-17.43934],[14.737631,-17.43928],[14.737972,-17.43915],[14.738223,-17.43904],[14.738484,-17.43892],[14.738735,-17.43878],[14.739033,-17.43861],[14.739414,-17.43837],[14.739644,-17.4382],[14.739865,-17.43803],[14.740096,-17.43783],[14.740282,-17.43767],[14.740428,-17.43753],[14.740585,-17.43737],[14.740775,-17.43716],[14.740971,-17.43691],[14.741145,-17.4367],[14.741275,-17.43652],[14.741445,-17.43627],[14.74159,-17.43603],[14.7417,-17.43585],[14.741792,-17.43568],[14.741854,-17.43557],[14.741904,-17.43547],[14.742043,-17.43522],[14.742164,-17.43494],[14.742278,-17.43466],[14.742394,-17.43434],[14.742482,-17.43404],[14.74255,-17.43377],[14.742615,-17.43347],[14.742801,-17.43262],[14.74309,-17.43135],[14.74333,-17.43025],[14.743704,-17.42866],[14.744093,-17.42697],[14.744193,-17.42649],[14.744324,-17.42589],[14.744454,-17.42523],[14.744576,-17.42458],[14.744653,-17.42418],[14.744856,-17.42309],[14.74503,-17.42216],[14.745266,-17.42076],[14.745454,-17.41947],[14.74555,-17.41884],[14.745639,-17.41824],[14.745717,-17.41751],[14.745751,-17.41702],[14.745765,-17.41634],[14.745756,-17.41593],[14.745734,-17.41494],[14.7457,-17.41369],[14.745675,-17.41287],[14.745688,-17.41188],[14.745663,-17.41146],[14.745553,-17.4106],[14.745407,-17.40979],[14.745373,-17.40963],[14.745465,-17.40965],[14.745504,-17.40963],[14.745563,-17.40962],[14.745659,-17.40964],[14.745902,-17.40967],[14.746098,-17.40968],[14.746154,-17.40969],[14.746224,-17.40969],[14.746268,-17.40968],[14.746311,-17.40967],[14.746344,-17.40964],[14.746394,-17.40956],[14.74645,-17.40948],[14.746509,-17.40943],[14.746616,-17.40939],[14.746705,-17.40938],[14.746776,-17.4094],[14.746843,-17.40945],[14.746888,-17.40949],[14.746923,-17.40955],[14.746977,-17.40958],[14.74703,-17.4096],[14.747087,-17.40961],[14.747187,-17.40961],[14.747246,-17.4096],[14.747345,-17.40957],[14.74741,-17.40954],[14.747461,-17.40952],[14.747555,-17.40948],[14.747576,-17.40947],[14.748274,-17.40908],[14.748441,-17.40897],[14.74894,-17.40871],[14.749043,-17.40865],[14.749732,-17.40834],[14.749819,-17.4083],[14.749877,-17.40826],[14.749922,-17.40822],[14.749969,-17.40818],[14.749978,-17.40815],[14.749994,-17.40812],[14.750015,-17.4081],[14.750039,-17.40808],[14.750067,-17.40807],[14.750097,-17.40807],[14.750126,-17.40807],[14.750161,-17.40808],[14.750192,-17.40811],[14.750221,-17.40815],[14.750311,-17.40815],[14.750421,-17.40815],[14.750527,-17.40814],[14.75077,-17.40809],[14.750844,-17.40806],[14.75097,-17.40801],[14.751114,-17.40795],[14.75123,-17.40789],[14.751368,-17.40781],[14.751583,-17.40768],[14.752049,-17.40736],[14.752407,-17.40712],[14.752757,-17.40689],[14.753515,-17.40641],[14.754159,-17.404],[14.754436,-17.40581],[14.754609,-17.40569],[14.755092,-17.40533],[14.755553,-17.40497],[14.755863,-17.40473],[14.756501,-17.40423],[14.757103,-17.40376],[14.75791,-17.40314],[14.758881,-17.40238],[14.758982,-17.4023],[14.759046,-17.40224],[14.759083,-17.4022],[14.759118,-17.40215],[14.759151,-17.4021],[14.759157,-17.40205],[14.759176,-17.402],[14.759207,-17.40196],[14.758954,-17.4017],[14.758334,-17.40107],[14.757778,-17.40051],[14.757424,-17.40016],[14.757319,-17.40005],[14.757249,-17.39998],[14.757169,-17.39988],[14.757011,-17.39967],[14.756964,-17.39961],[14.756922,-17.39955],[14.756869,-17.39946],[14.756823,-17.39935],[14.756743,-17.39908],[14.756713,-17.3989],[14.756702,-17.39881],[14.756697,-17.39872],[14.756663,-17.39809],[14.756635,-17.39748],[14.756614,-17.39691],[14.756613,-17.39688],[14.756613,-17.39684],[14.756585,-17.39668],[14.756576,-17.39667],[14.756561,-17.39666],[14.756552,-17.39664],[14.75655,-17.39662],[14.756557,-17.3966],[14.756514,-17.3965],[14.755934,-17.39566],[14.755681,-17.3953],[14.755474,-17.39501],[14.755365,-17.39485],[14.755133,-17.39453],[14.754889,-17.39418],[14.754657,-17.39388],[14.754643,-17.39386],CITIES['Pikine']] },
  'L02': { nom: 'Dakar - Rufisque', color: '#00d4aa', path: [[14.662761,-17.43748],[14.663496,-17.4373],[14.664441,-17.43698],[14.666337,-17.43701],[14.666875,-17.43707],[14.666991,-17.43708],[14.667615,-17.43714],[14.668272,-17.43721],[14.669013,-17.43727],[14.669218,-17.43729],[14.669287,-17.4373],[14.669373,-17.4373],[14.669499,-17.43731],[14.669704,-17.43732],[14.669849,-17.43733],[14.670364,-17.43734],[14.670934,-17.43736],[14.671535,-17.43739],[14.672175,-17.4374],[14.672668,-17.43742],[14.673166,-17.43744],[14.674083,-17.43747],[14.674718,-17.43748],[14.675358,-17.4375],[14.675717,-17.43751],[14.6762,-17.43752],[14.677019,-17.43755],[14.677226,-17.43756],[14.677909,-17.43757],[14.678773,-17.43758],[14.679059,-17.43759],[14.679497,-17.43766],[14.679792,-17.43768],[14.6798,-17.43767],[14.679823,-17.43764],[14.679851,-17.43762],[14.679881,-17.4376],[14.679913,-17.43759],[14.679947,-17.43759],[14.67998,-17.43759],[14.680012,-17.43759],[14.680041,-17.43762],[14.680065,-17.43765],[14.680085,-17.43768],[14.680099,-17.43771],[14.680106,-17.43774],[14.680106,-17.43778],[14.680099,-17.43781],[14.680093,-17.43788],[14.680096,-17.4379],[14.680103,-17.43794],[14.680133,-17.438],[14.680154,-17.43803],[14.680201,-17.43808],[14.680295,-17.43815],[14.68046,-17.4383],[14.68053,-17.43836],[14.68071,-17.43849],[14.680756,-17.43853],[14.681113,-17.4388],[14.683534,-17.44044],[14.683761,-17.44058],[14.683857,-17.44064],[14.684124,-17.44074],[14.684413,-17.44084],[14.684667,-17.44095],[14.684837,-17.44101],[14.685233,-17.44113],[14.685561,-17.44123],[14.685764,-17.44128],[14.686074,-17.44136],[14.686323,-17.44142],[14.687345,-17.44167],[14.688137,-17.44187],[14.688778,-17.44203],[14.689274,-17.44216],[14.689567,-17.44223],[14.690414,-17.44243],[14.690635,-17.44247],[14.6909,-17.44252],[14.691107,-17.44255],[14.691302,-17.44257],[14.691445,-17.44258],[14.691606,-17.44259],[14.691801,-17.44259],[14.691998,-17.44259],[14.693798,-17.44247],[14.695026,-17.44237],[14.695298,-17.44236],[14.699124,-17.44213],[14.700093,-17.44207],[14.700355,-17.44205],[14.711954,-17.44128],[14.719258,-17.44078],[14.719884,-17.44073],[14.721214,-17.44064],[14.722602,-17.44054],[14.723052,-17.44052],[14.723472,-17.44049],[14.724774,-17.44042],[14.725076,-17.4404],[14.725159,-17.4404],[14.725581,-17.44038],[14.725667,-17.44037],[14.725796,-17.44036],[14.726096,-17.44035],[14.726303,-17.44033],[14.726544,-17.44032],[14.728509,-17.44018],[14.731519,-17.44],[14.733682,-17.43985],[14.735612,-17.43971],[14.736025,-17.43969],[14.736387,-17.43962],[14.736532,-17.43959],[14.736651,-17.43956],[14.736917,-17.4395],[14.737244,-17.43941],[14.737462,-17.43934],[14.737631,-17.43928],[14.737972,-17.43915],[14.738223,-17.43904],[14.738484,-17.43892],[14.738735,-17.43878],[14.739033,-17.43861],[14.739414,-17.43837],[14.739644,-17.4382],[14.739865,-17.43803],[14.740096,-17.43783],[14.740282,-17.43767],[14.740428,-17.43753],[14.740585,-17.43737],[14.740775,-17.43716],[14.740971,-17.43691],[14.741145,-17.4367],[14.741275,-17.43652],[14.741445,-17.43627],[14.74159,-17.43603],[14.7417,-17.43585],[14.741792,-17.43568],[14.741854,-17.43557],[14.741904,-17.43547],[14.742043,-17.43522],[14.742164,-17.43494],[14.742278,-17.43466],[14.742394,-17.43434],[14.742482,-17.43404],[14.74255,-17.43377],[14.742615,-17.43347],[14.742801,-17.43262],[14.74309,-17.43135],[14.74333,-17.43025],[14.743704,-17.42866],[14.744093,-17.42697],[14.744193,-17.42649],[14.744324,-17.42589],[14.744454,-17.42523],[14.744576,-17.42458],[14.744653,-17.42418],[14.744856,-17.42309],[14.74503,-17.42216],[14.745266,-17.42076],[14.745454,-17.41947],[14.74555,-17.41884],[14.745639,-17.41824],[14.745717,-17.41751],[14.745751,-17.41702],[14.745765,-17.41634],[14.745756,-17.41593],[14.745734,-17.41494],[14.745724,-17.41317],[14.745745,-17.41273],[14.745802,-17.4118],[14.745846,-17.41107],[14.745847,-17.41093],[14.745847,-17.41082],[14.745844,-17.41069],[14.745807,-17.41031],[14.745784,-17.4101],[14.745743,-17.40986],[14.745664,-17.40947],[14.745518,-17.40897],[14.745391,-17.40863],[14.745224,-17.40826],[14.745078,-17.40795],[14.744915,-17.4076],[14.74474,-17.4072],[14.744525,-17.40672],[14.74426,-17.40612],[14.744063,-17.4057],[14.744003,-17.40557],[14.743894,-17.40534],[14.743683,-17.40488],[14.743499,-17.40446],[14.743292,-17.404],[14.743116,-17.40361],[14.743005,-17.40335],[14.742859,-17.40299],[14.742732,-17.40259],[14.742613,-17.40214],[14.74256,-17.40189],[14.742521,-17.40167],[14.74247,-17.40128],[14.742453,-17.40111],[14.742436,-17.40089],[14.742418,-17.40042],[14.74243,-17.40011],[14.742449,-17.39979],[14.742483,-17.39941],[14.742589,-17.39881],[14.742807,-17.39768],[14.742894,-17.3973],[14.742951,-17.39707],[14.743026,-17.39682],[14.743116,-17.39656],[14.743205,-17.39632],[14.743307,-17.39608],[14.743402,-17.39587],[14.743502,-17.39566],[14.743622,-17.39544],[14.743772,-17.39519],[14.743926,-17.39495],[14.744071,-17.39473],[14.744196,-17.39451],[14.744354,-17.39423],[14.744496,-17.39395],[14.744619,-17.39367],[14.744748,-17.39334],[14.744884,-17.39299],[14.74524,-17.39209],[14.745418,-17.39166],[14.745556,-17.3913],[14.745738,-17.39084],[14.745901,-17.3904],[14.746057,-17.38994],[14.746172,-17.38958],[14.746419,-17.38875],[14.746632,-17.38795],[14.747264,-17.38538],[14.747697,-17.38362],[14.747802,-17.38321],[14.74811,-17.38197],[14.748322,-17.38119],[14.748686,-17.37997],[14.748896,-17.37935],[14.749283,-17.37828],[14.749727,-17.37719],[14.749856,-17.37687],[14.750433,-17.37562],[14.750572,-17.37532],[14.750616,-17.37521],[14.750777,-17.37483],[14.750855,-17.37467],[14.752249,-17.37167],[14.75228,-17.37161],[14.752308,-17.37155],[14.752381,-17.3714],[14.752818,-17.37054],[14.753198,-17.36978],[14.753596,-17.36894],[14.753731,-17.36863],[14.754122,-17.36757],[14.75428,-17.3671],[14.754463,-17.36651],[14.754612,-17.36601],[14.754694,-17.3657],[14.757154,-17.35634],[14.757686,-17.3545],[14.75798,-17.3534],[14.758704,-17.35083],[14.758962,-17.34972],[14.759078,-17.34919],[14.759154,-17.34882],[14.759195,-17.34863],[14.759316,-17.34804],[14.759417,-17.34754],[14.759508,-17.347],[14.759552,-17.34672],[14.7596,-17.34645],[14.759662,-17.34605],[14.759686,-17.34585],[14.759769,-17.34511],[14.759815,-17.34472],[14.759855,-17.34441],[14.759895,-17.34391],[14.759951,-17.34333],[14.759984,-17.34279],[14.759999,-17.34241],[14.76001,-17.34213],[14.760022,-17.34178],[14.760042,-17.34134],[14.760056,-17.34096],[14.760059,-17.34026],[14.760047,-17.33969],[14.760038,-17.33911],[14.760007,-17.33852],[14.759976,-17.33792],[14.759955,-17.33755],[14.759925,-17.33708],[14.759891,-17.3367],[14.759844,-17.33621],[14.75981,-17.33587],[14.759801,-17.33579],[14.759792,-17.33571],[14.759773,-17.33556],[14.759729,-17.33524],[14.759671,-17.33478],[14.759604,-17.33435],[14.759523,-17.33385],[14.759442,-17.3338],[14.759351,-17.33287],[14.759288,-17.33254],[14.759233,-17.33228],[14.75915,-17.33192],[14.759083,-17.33162],[14.758988,-17.3312],[14.758912,-17.33089],[14.758858,-17.33068],[14.758749,-17.33027],[14.758631,-17.32981],[14.758463,-17.32925],[14.758331,-17.32879],[14.757068,-17.32492],[14.756627,-17.32357],[14.756367,-17.32269],[14.755913,-17.32113],[14.755679,-17.32021],[14.755554,-17.31963],[14.755462,-17.31926],[14.755268,-17.31833],[14.755127,-17.31758],[14.754986,-17.31671],[14.754935,-17.3164],[14.754659,-17.31453],[14.754481,-17.31325],[14.75426,-17.31163],[14.753999,-17.30982],[14.753923,-17.30927],[14.75385,-17.30875],[14.753724,-17.30781],[14.753631,-17.30715],[14.753563,-17.30665],[14.753394,-17.30544],[14.753233,-17.30432],[14.753119,-17.30346],[14.753052,-17.30301],[14.752999,-17.30262],[14.752814,-17.30158],[14.752683,-17.30097],[14.752533,-17.30036],[14.752362,-17.29975],[14.752283,-17.29947],[14.752073,-17.2988],[14.751824,-17.2981],[14.751566,-17.29743],[14.751292,-17.2968],[14.750538,-17.29508],[14.749766,-17.29339],[14.749401,-17.29256],[14.749039,-17.29175],[14.748342,-17.29019],[14.747978,-17.28956],[14.747877,-17.28944],[14.74778,-17.28934],[14.747614,-17.28923],[14.747397,-17.28915],[14.747199,-17.2891],[14.746936,-17.2891],[14.746672,-17.28914],[14.746078,-17.28923],[14.745869,-17.28925],[14.745709,-17.28921],[14.7456,-17.28914],[14.745509,-17.28905],[14.745468,-17.28899],[14.745436,-17.28893],[14.745427,-17.28887],[14.745383,-17.28887],[14.74534,-17.28887],[14.745299,-17.28885],[14.745262,-17.28883],[14.74523,-17.28879],[14.745104,-17.2888],[14.745009,-17.2888],[14.744879,-17.28881],[14.744645,-17.28883],[14.744452,-17.28883],[14.744327,-17.28883],[14.744212,-17.28882],[14.744038,-17.28879],[14.743931,-17.28876],[14.743879,-17.28875],[14.7437,-17.28869],[14.743456,-17.28861],[14.743212,-17.28852],[14.742975,-17.28846],[14.742883,-17.28844],[14.74279,-17.28843],[14.742768,-17.28843],[14.742602,-17.28843],[14.742529,-17.28843],[14.742425,-17.28843],[14.74189,-17.28848],[14.740719,-17.28859],[14.740215,-17.28864],[14.739939,-17.28865],[14.739704,-17.28868],[14.739689,-17.28869],[14.739657,-17.28872],[14.73962,-17.28872],[14.739583,-17.28871],[14.739553,-17.28869],[14.739539,-17.28867],[14.739319,-17.28865],[14.739211,-17.28864],[14.73913,-17.28863],[14.739058,-17.28861],[14.738938,-17.28857],[14.738824,-17.28853],[14.738626,-17.28844],[14.738438,-17.28833],[14.738283,-17.28825],[14.738164,-17.2882],[14.738038,-17.28816],[14.737309,-17.28795],[14.736214,-17.28763],[14.736085,-17.28759],[14.735309,-17.28737],[14.735072,-17.2873],[14.734959,-17.28726],[14.734931,-17.28727],[14.734901,-17.28728],[14.734873,-17.28726],[14.73486,-17.28725],[14.734725,-17.28724],[14.734662,-17.28715],[14.734641,-17.28714],[14.734616,-17.28711],[14.734443,-17.28706],[14.734164,-17.28698],[14.734001,-17.28693],[14.733679,-17.28684],[14.733412,-17.28676],[14.733275,-17.28672],[14.732947,-17.28663],[14.732882,-17.28661],[14.732628,-17.28654],[14.732229,-17.28643],[14.731629,-17.28624],[14.731397,-17.28617],[14.731343,-17.28614],[14.731313,-17.28612],[14.731274,-17.2861],[14.731247,-17.28607],[14.730944,-17.2856],[14.730753,-17.2853],[14.730564,-17.285],[14.730403,-17.28475],[14.730363,-17.28469],[14.729824,-17.28384],[14.729612,-17.28351],[14.729415,-17.2832],[14.72921,-17.28288],[14.729047,-17.28262],[14.728966,-17.28255],[14.728918,-17.28252],[14.72888,-17.2825],[14.728845,-17.28248],[14.728778,-17.28243],[14.72875,-17.28243],[14.728723,-17.28242],[14.728697,-17.2824],[14.728681,-17.28237],[14.728677,-17.28235],[14.728605,-17.28233],[14.728555,-17.28232],[14.728483,-17.28232],[14.728363,-17.28232],[14.728017,-17.28232],[14.727538,-17.28233],[14.726349,-17.28235],[14.725203,-17.28238],[14.724768,-17.28239],[14.724321,-17.2824],[14.723908,-17.2824],[14.723523,-17.28242],[14.723198,-17.28243],[14.722964,-17.28243],[14.722837,-17.28243],[14.722752,-17.28241],[14.722642,-17.28236],[14.722554,-17.2823],[14.72251,-17.28226],[14.722462,-17.28221],[14.722402,-17.28212],[14.722365,-17.28204],[14.722325,-17.28193],[14.722316,-17.28181],[14.722326,-17.28169],[14.72234,-17.2816],[14.722363,-17.28148],[14.722361,-17.28135],[14.722313,-17.28118],[14.722275,-17.28112],[14.722181,-17.28103],[14.722148,-17.28101],[14.722061,-17.28106],[14.721713,-17.28123],[14.721561,-17.28131],[14.720886,-17.28174],[14.720679,-17.28186],[14.720523,-17.28199],[14.720383,-17.28214],[14.720278,-17.28227],[14.720212,-17.28239],[14.720219,-17.28243],[14.720217,-17.28247],[14.720205,-17.28251],[14.720188,-17.28254],[14.720165,-17.28257],[14.720137,-17.28259],[14.720105,-17.2826],[14.720071,-17.28261],[14.720037,-17.2826],[14.719987,-17.28259],[14.719945,-17.28256],[14.719914,-17.28251],[14.719899,-17.28245],[14.719855,-17.28245],[14.719789,-17.28229],[14.719698,-17.28229],[14.719515,-17.28221],[14.719471,-17.28219],[14.719179,-17.28201],[14.718951,-17.28182],[14.718729,-17.28158],[14.718317,-17.28192],[14.71812,-17.28204],[14.717943,-17.2821],[14.717469,-17.28242],[14.717555,-17.28257],[14.71755,-17.28261],[14.717533,-17.28263],[14.717339,-17.28278],[14.71704,-17.28293],[14.716753,-17.28308],[14.716622,-17.28316],CITIES['Rufisque']] },
  'L03': { nom: 'Dakar - Thiès', color: '#7c5bff', path: [[14.662761,-17.43748],[14.6728,-17.4333],[14.7167,-17.2833],[14.72,-17.20],[14.75,-17.15],[14.76,-17.10],[14.78,-17.00],CITIES['Thies']] },
  'L04': { nom: 'Pikine - Rufisque', color: '#ffb347', path: [[14.768323,-17.398626],[14.76962,-17.397417],[14.768884,-17.396299],[14.765982,-17.395267],[14.763525,-17.389067],[14.759828,-17.381396],[14.757166,-17.38081],[14.756786,-17.38067],[14.754352,-17.37955],[14.752672,-17.378739],[14.751168,-17.37768],[14.749214,-17.376931],[14.748015,-17.377228],[14.750349,-17.375555],[14.750855,-17.37467],[14.752249,-17.37167],[14.753198,-17.36978],[14.753596,-17.36894],[14.754694,-17.3657],[14.757154,-17.35634],[14.758704,-17.35083],[14.759508,-17.347],[14.760047,-17.33969],[14.759976,-17.33792],[14.75981,-17.33587],[14.758631,-17.32981],[14.757068,-17.32492],[14.755913,-17.32113],[14.754659,-17.31453],[14.75426,-17.31163],[14.753999,-17.30982],[14.753233,-17.30432],[14.752814,-17.30158],[14.752073,-17.2988],[14.751292,-17.2968],[14.749766,-17.29339],[14.749401,-17.29256],[14.748342,-17.29019],[14.747978,-17.28956],[14.747877,-17.28944],[14.747614,-17.28923],[14.747199,-17.2891],[14.746936,-17.2891],[14.746078,-17.28923],[14.745869,-17.28925],[14.7456,-17.28914],[14.7437,-17.28869],[14.742529,-17.28843],[14.74189,-17.28848],[14.740215,-17.28864],[14.739704,-17.28868],[14.738626,-17.28844],[14.736214,-17.28763],[14.735309,-17.28737],[14.734443,-17.28706],[14.732628,-17.28654],[14.731397,-17.28617],[14.730564,-17.285],[14.729824,-17.28384],[14.729415,-17.2832],[14.72921,-17.28288],[14.729047,-17.28262],[14.728966,-17.28255],[14.72888,-17.2825],[14.728778,-17.28243],[14.728605,-17.28233],[14.728483,-17.28232],[14.728017,-17.28232],[14.727538,-17.28233],[14.726349,-17.28235],[14.725203,-17.28238],[14.724321,-17.2824],[14.723523,-17.28242],[14.722837,-17.28243],[14.722752,-17.28241],[14.722642,-17.28236],[14.722316,-17.28193],[14.722061,-17.28106],[14.721713,-17.28123],[14.720886,-17.28174],[14.720383,-17.28214],[14.720212,-17.28239],[14.720219,-17.28243],[14.720205,-17.28251],[14.720188,-17.28254],[14.719945,-17.28256],[14.719899,-17.28245],[14.719789,-17.28229],[14.719515,-17.28221],[14.719179,-17.28201],[14.718951,-17.28182],[14.718729,-17.28158],[14.718317,-17.28192],[14.71812,-17.28204],[14.717943,-17.2821],[14.717469,-17.28242],[14.717555,-17.28257],[14.717339,-17.28278],[14.71704,-17.28293],[14.716753,-17.28308],[14.716622,-17.28316],CITIES['Rufisque']] },
  'L05': { nom: 'Dakar - Mbour', color: '#ff6b9d', path: [[14.662761,-17.43748],[14.6728,-17.4333],[14.7167,-17.2833],[14.65,-17.20],[14.60,-17.15],[14.55,-17.10],[14.50,-17.05],[14.45,-17.00],CITIES['Mbour']] }
};

// Component to recenter map when selected line changes
function RecenterMap({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);
  return null;
}

function DataViews({ apiUrl }) {
  const [activeView, setActiveView] = useState('vehicules');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  const [selectedRow, setSelectedRow] = useState(null);

  const views = useMemo(() => [
    { id: 'vehicules',  name: 'Véhicules',  endpoint: '/vehicules',  emoji: '🚌' },
    { id: 'chauffeurs', name: 'Chauffeurs', endpoint: '/chauffeurs', emoji: '👨‍✈️' },
    { id: 'trajets',    name: 'Trajets',    endpoint: '/trajets',    emoji: '🗺️' },
    { id: 'incidents',  name: 'Incidents',  endpoint: '/incidents',  emoji: '⚠️' },
    { id: 'lignes',     name: 'Lignes',     endpoint: '/lignes',     emoji: '🛤️' },
    { id: 'tarifs',     name: 'Tarifs',     endpoint: '/tarifs',     emoji: '💰' },
  ], []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setSearch('');
      setSelectedRow(null);
      const view = views.find(v => v.id === activeView);
      const response = await axios.get(`${apiUrl}${view.endpoint}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeView, apiUrl, views]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  }, [data, search]);

  const exportCSV = () => {
    if (data.length === 0) return;
    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeView}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatHeader = (key) =>
    key.replace(/_/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return <span className="opacity-30">—</span>;
    if (typeof value === 'number') {
      if (key.includes('prix') || key.includes('recette'))
        return <span className="text-accentSecondary font-semibold">{value.toLocaleString()} FCFA</span>;
      if (key.includes('date') || key.includes('heure'))
        return new Date(value).toLocaleString('fr-FR');
    }
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${value ? 'bg-[#00d4aa]/15 text-[#00d4aa]' : 'bg-[#ff6b9d]/15 text-[#ff6b9d]'}`}>
          {value ? '✓ Oui' : '✗ Non'}
        </span>
      );
    }
    return String(value);
  };

  const hasDetailPanel = activeView === 'lignes' || activeView === 'trajets' || activeView === 'vehicules' || activeView === 'chauffeurs';
  const mapData = (activeView === 'lignes' || activeView === 'trajets') && selectedRow ? (LIGNES_MAP_DATA[selectedRow.code] || LIGNES_MAP_DATA[selectedRow.ligne_code]) : null;

  return (
    <div className="animate-fade-slide-up opacity-0 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-textPrimary mb-1 tracking-tight">Explorateur de Données</h2>
        <p className="text-textSecondary text-base">Consultez, filtrez et exportez les données en temps réel</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {views.map(view => (
          <button
            key={view.id}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeView === view.id
                ? 'bg-gradient-primary text-white shadow-[0_4px_15px_rgba(124,91,255,0.3)]'
                : 'bg-[var(--bg-surface)] text-textSecondary border border-[var(--border-color)] hover:text-textPrimary hover:bg-[var(--bg-elevated)]'}`}
            onClick={() => setActiveView(view.id)}
          >
            <span className="mr-1.5">{view.emoji}</span>{view.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      {!loading && !error && (
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-bgTertiary border border-[var(--border-color)] rounded-xl py-2.5 pl-9 pr-10 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-accentPrimary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          
          <button
            onClick={exportCSV}
            disabled={data.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/20 rounded-xl text-sm text-[#00d4aa] font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} /> Export
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#7c5bff]/20 border-t-accentPrimary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#ff6b9d]">
          <AlertTriangle size={48} />
          <p className="text-lg font-medium">{error}</p>
          <button onClick={fetchData} className="px-5 py-2.5 bg-accentPrimary rounded-lg text-white">Réessayer</button>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden transition-all duration-500`}>
          
          {/* Table Container */}
          <div className={`flex-1 bg-bgSurface backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-lg flex flex-col overflow-hidden transition-all duration-500`}>
            {(activeView === 'lignes' || activeView === 'trajets' || activeView === 'vehicules') && (
              <div className="bg-accentInfo/10 px-4 py-3 border-b border-accentInfo/20 flex items-center gap-2 text-sm text-accentInfo font-medium">
                <MapPin size={16} /> Cliquez sur une ligne de tableau pour voir les détails {activeView === 'vehicules' || activeView === 'chauffeurs' ? 'et l\'aperçu IA' : 'sur la carte'} !
              </div>
            )}
            
            <div className="flex-1 overflow-auto">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center gap-3 text-center py-16 text-textMuted">
                  <FileX size={40} className="opacity-40" />
                  <p className="text-sm">Aucune donnée disponible.</p>
                </div>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-bgTertiary z-[2] shadow-sm">
                    <tr>
                      {Object.keys(filteredData[0]).filter(k => !['created_at', 'updated_at'].includes(k)).map(col => (
                        <th key={col} className="px-5 py-4 text-left font-semibold text-textSecondary uppercase text-[10px] tracking-widest border-b border-[var(--border-color)] whitespace-nowrap">
                          {formatHeader(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, idx) => (
                      <tr key={idx} 
                          onClick={() => { if (hasDetailPanel) setSelectedRow(row); }}
                          className={`transition-colors duration-100 border-b border-[var(--border-color)] last:border-b-0
                            ${hasDetailPanel ? 'cursor-pointer hover:bg-accentPrimary/10' : 'hover:bg-bgElevated'}
                            ${selectedRow && selectedRow.id === row.id ? 'bg-accentPrimary/20' : ''}`}>
                        {Object.keys(filteredData[0]).filter(k => !['created_at', 'updated_at'].includes(k)).map(col => (
                          <td key={col} className="px-5 py-3.5 text-textPrimary whitespace-nowrap text-sm">
                            {formatValue(row[col], col)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Map Container */}
          {/* Interactive Panels (Map or Vehicle Detail) */}
          {hasDetailPanel && selectedRow && (
            <div className="lg:w-[450px] w-full bg-bgSurface backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-lg flex flex-col overflow-hidden animate-scale-in">
              
              {/* Common Header */}
              <div className="p-4 border-b border-[var(--border-color)] bg-bgTertiary flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-textPrimary">
                    {activeView === 'vehicules' ? selectedRow.immatriculation : (selectedRow.nom || selectedRow.ligne_nom)}
                  </h3>
                  <p className="text-xs text-textSecondary uppercase tracking-wider font-semibold">
                    {activeView === 'vehicules' ? `${selectedRow.marque} ${selectedRow.modele}` : 
                     activeView === 'chauffeurs' ? `Capitaine Flotte #${String(selectedRow.id).padStart(3, '0')}` :
                     activeView === 'trajets' ? `ID: #${selectedRow.id}` : 'Détails de la ligne'}
                  </p>
                </div>
                <button onClick={() => setSelectedRow(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-textMuted hover:text-textPrimary">
                  <X size={16} />
                </button>
              </div>

              {/* View-Specific Content */}
              <div className="flex-1 relative overflow-auto">
                {activeView === 'vehicules' ? (
                  <div className="flex flex-col h-full">
                    {/* AI Vehicle Image */}
                    <div className="aspect-video w-full bg-black relative group overflow-hidden">
                      <img 
                        src={VEHICLE_IMAGES[selectedRow.type_vehicule?.toLowerCase()] || VEHICLE_IMAGES.default} 
                        alt="Vehicle Preview" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Aperçu généré par IA</span>
                      </div>
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border 
                        ${selectedRow.status === 'actif' || selectedRow.status === 'disponible' 
                          ? 'bg-[#00d4aa]/20 border-[#00d4aa]/30 text-[#00d4aa]' 
                          : 'bg-[#ffb347]/20 border-[#ffb347]/30 text-[#ffb347]'}`}>
                        {selectedRow.status}
                      </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bgTertiary p-3 rounded-xl border border-[var(--border-color)]">
                          <p className="text-[10px] text-textSecondary uppercase font-bold mb-1 opacity-50">Capacité</p>
                          <p className="text-lg font-bold text-accentPrimary">{selectedRow.capacite} <span className="text-xs font-normal text-textSecondary">Places</span></p>
                        </div>
                        <div className="bg-bgTertiary p-3 rounded-xl border border-[var(--border-color)]">
                          <p className="text-[10px] text-textSecondary uppercase font-bold mb-1 opacity-50">Type</p>
                          <p className="text-lg font-bold text-accentSecondary uppercase">{selectedRow.type_vehicule || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                          <span className="text-sm text-textSecondary">Kilométrage</span>
                          <span className="text-sm font-semibold text-textPrimary">{(selectedRow.kilometrage || 0).toLocaleString()} KM</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                          <span className="text-sm text-textSecondary">Dernière Maintenance</span>
                          <span className="text-sm font-medium text-textPrimary">
                            {selectedRow.derniere_maintenance ? new Date(selectedRow.derniere_maintenance).toLocaleDateString('fr-FR') : 'Non planifiée'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                          <span className="text-sm text-textSecondary">Consommation Estimée</span>
                          <span className="text-sm font-medium text-[#00d4aa]">Modérée</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-accentPrimary hover:bg-accentPrimary/80 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-accentPrimary/20 mt-4">
                        Planifier Maintenance
                      </button>
                    </div>
                  </div>
                ) : activeView === 'chauffeurs' ? (
                  <div className="flex flex-col h-full p-6">
                    {/* Digital ID Card */}
                    <div className="relative bg-gradient-to-br from-bgTertiary to-bgSurface border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl overflow-hidden group">
                      {/* Decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accentPrimary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                      
                      <div className="flex flex-col items-center gap-6 relative z-10">
                        {/* Portrait */}
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-accentPrimary/20 shadow-xl bg-bgTertiary">
                          <img 
                            src={(function() {
                              const maleNames = ['cheikh ba', 'moussa diouf', 'ibrahima fall', 'ousmane kane'];
                              const fullName = `${selectedRow.prenom} ${selectedRow.nom}`.toLowerCase().trim();
                              const isMale = maleNames.includes(fullName);
                              return isMale ? STAFF_PORTRAITS[0] : STAFF_PORTRAITS[1];
                            })()} 
                            alt="Driver Portrait" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        
                        <div className="text-center">
                          <h4 className="text-xl font-bold text-textPrimary tracking-tight">{selectedRow.prenom} {selectedRow.nom}</h4>
                          <p className="text-xs text-accentPrimary font-bold uppercase tracking-widest mt-1">Capitaine Certifié</p>
                        </div>

                        {/* ID Stats */}
                        <div className="w-full grid grid-cols-2 gap-3 mt-2">
                          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[9px] text-textMuted uppercase font-bold mb-0.5">Permis</p>
                            <p className="text-sm font-bold text-textPrimary">{selectedRow.permis}</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[9px] text-textMuted uppercase font-bold mb-0.5">Statut</p>
                            <p className={`text-sm font-bold uppercase ${selectedRow.statut === 'actif' ? 'text-[#00d4aa]' : 'text-[#ffb347]'}`}>{selectedRow.statut}</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="w-full space-y-3 mt-2">
                          <div className="flex items-center gap-3 px-4 py-3 bg-bgTertiary/50 rounded-xl border border-[var(--border-color)]">
                            <div className="w-8 h-8 rounded-lg bg-accentPrimary/10 flex items-center justify-center text-accentPrimary">
                              <span className="text-xs">📞</span>
                            </div>
                            <span className="text-sm font-medium text-textSecondary">{selectedRow.telephone}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 bg-bgTertiary/50 rounded-xl border border-[var(--border-color)]">
                            <div className="w-8 h-8 rounded-lg bg-accentSecondary/10 flex items-center justify-center text-accentSecondary">
                              <span className="text-xs">✉️</span>
                            </div>
                            <span className="text-sm font-medium text-textSecondary truncate">{selectedRow.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fake Hologram Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accentPrimary/40 to-transparent"></div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-center text-sm px-2">
                        <span className="text-textMuted font-medium">Date d'embauche</span>
                        <span className="text-textPrimary font-semibold">{new Date(selectedRow.date_embauche).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm px-2">
                        <span className="text-textMuted font-medium">Expérience</span>
                        <span className="text-textPrimary font-semibold">3+ Ans</span>
                      </div>
                      <button className="w-full py-3 border border-accentPrimary/30 hover:bg-accentPrimary/5 text-accentPrimary rounded-xl font-bold text-sm transition-all mt-4">
                        Voir Historique Trajets
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Map remains the same but with generic selectedRow */
                  <div className="h-full bg-[#e5e5e5] dark:bg-[#0f0f14]">
                    {mapData ? (
                      <MapContainer center={mapData.path[1] || mapData.path[0]} zoom={11} scrollWheelZoom={true} className="w-full h-full">
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Polyline positions={mapData.path} color={mapData.color} weight={5} opacity={0.8} />
                        <Marker position={mapData.path[0]}>
                          <Popup>{selectedRow.depart || selectedRow.ligne_nom?.split(' - ')[0]?.replace('Ligne ', '') || 'Dakar'}</Popup>
                        </Marker>
                        <Marker position={mapData.path[mapData.path.length - 1]}>
                          <Popup>{selectedRow.arrivee || selectedRow.ligne_nom?.split(' - ')[1] || 'Arrivée'}</Popup>
                        </Marker>
                        <RecenterMap path={mapData.path} />
                      </MapContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-textMuted text-sm">
                        Données GPS non disponibles pour ce trajet.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* View-Specific Footer */}
              <div className="p-3 border-t border-[var(--border-color)] bg-bgTertiary flex justify-between text-xs text-textSecondary">
                {activeView === 'trajets' ? (
                  <>
                    <span>Véhicule: <strong>{selectedRow.immatriculation}</strong></span>
                    <span>Chauffeur: <strong>{selectedRow.chauffeur}</strong></span>
                  </>
                ) : activeView === 'lignes' ? (
                  <>
                    <span>Distance: <strong>{selectedRow.distance_km} km</strong></span>
                    <span>Durée: <strong>{selectedRow.duree_estimee} min</strong></span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedRow.status === 'actif' || selectedRow.statut === 'actif' ? 'animate-pulse bg-[#00d4aa]' : 'bg-gray-500'}`}></div>
                    <span className="italic">Système de télémétrie IA actif</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataViews;
