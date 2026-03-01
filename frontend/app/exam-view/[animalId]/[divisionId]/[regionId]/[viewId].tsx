import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getView, getRegion } from '../../../../data';
import { ExamComponent } from '../../../../ExamShared';

export default function ExamViewScreen() {
  const { animalId, divisionId, regionId, viewId } = useLocalSearchParams<{ animalId: string; divisionId: string; regionId: string; viewId: string }>();
  const view = getView(animalId!, divisionId!, regionId!, viewId!);
  const region = getRegion(animalId!, divisionId!, regionId!);
  if (!view || !region) return null;
  // Collect all bone names from all views for distractors
  const allViewNames = region.views?.flatMap(v => v.questions.map(q => q.name)) || [];
  return (
    <ExamComponent
      title={view.name}
      subtitle={region.name}
      imageKey={regionId!}
      viewKey={viewId!}
      questions={view.questions}
      divisionBoneNames={allViewNames}
    />
  );
}
