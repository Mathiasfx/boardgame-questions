export interface Board {
userId: string;
title: string;
colorPrimary: string;
colorSecondary: string;
background: string;
questions: {question: string; answer: string}[];
}