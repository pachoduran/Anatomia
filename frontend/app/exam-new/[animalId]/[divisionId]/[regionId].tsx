import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getRegion, getDivisionBoneNames } from '../../../data';
import { ExamComponent } from '../../../ExamShared';

export default function ExamScreen() {
  const { animalId, divisionId, regionId } = useLocalSearchParams<{ animalId: string; divisionId: string; regionId: string }>();
  const region = getRegion(animalId!, divisionId!, regionId!);
  const divNames = getDivisionBoneNames(animalId!, divisionId!);
  if (!region) return null;
  return (
    <ExamComponent
      title={region.name}
      subtitle="Examen"
      imageKey={region.imageKey}
      questions={region.questions}
      divisionBoneNames={divNames}
    />
  );
}
