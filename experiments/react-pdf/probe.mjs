import { createElement as h } from 'react';
import ReactPDF, { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
const s = StyleSheet.create({
  page:{padding:20,fontSize:12},
  inlineChip:{backgroundColor:'#cce',borderRadius:4,padding:4,top:-3}, // inline run
  viewChip:{backgroundColor:'#cec',borderRadius:4,padding:4}, // block box
});
const Doc=()=>h(Document,null,h(Page,{size:'A4',style:s.page},
  h(Text,null,'before ',h(Text,{style:s.inlineChip},'INLINE'),' after nudge? radius? padding?'),
  h(View,{style:{flexDirection:'row',marginTop:10}},h(Text,null,'row: '),h(View,{style:s.viewChip},h(Text,null,'VIEW'))),
));
await ReactPDF.render(h(Doc),'experiments/react-pdf/compare/probe.pdf');
console.log('ok');
