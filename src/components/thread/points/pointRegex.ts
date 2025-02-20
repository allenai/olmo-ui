export const pointsPattern =
    /<points\s((?:x\d+="[\d.]+")\s(?:y\d+="[\d.]+")\s?)+alt="([^"]*)">(.*?)<\/points>/g;

// const pointsTest =
//     '<points x1="5.5" y1="81.0" x2="9.5" y2="73.5" x3="14.0" y3="78.8" x4="17.9" y4="65.0" x5="22.5" y5="73.5" x6="26.5" y6="85.0" x7="30.5" y7="78.8" x8="34.5" y8="82.0" x9="38.9" y9="90.0" x10="43.5" y10="96.5" x11="47.0" y11="95.5" x12="50.5" y12="68.0" x13="54.5" y13="67.5" x14="58.5" y14="68.0" x15="62.5" y15="94.0" x16="66.5" y16="96.5" x17="70.5" y17="69.5" x18="76.5" y18="96.5" x19="79.5" y19="69.0" x20="83.0" y20="80.0" x21="86.5" y21="81.0" alt="faders.">faders.</points>';

export const pointPattern = /<point\s+x="([\d.]+)"\s+y="([\d.]+)"\s+alt="([^"]*)">(.*?)<\/point>/g;

// const pointTest = '<point x="51.2" y="26.4" alt="cat">cat</point>';

export const coordinatePattern = /x(\d+)="([\d.]+)"\s*y\1="([\d.]+)"/g;
