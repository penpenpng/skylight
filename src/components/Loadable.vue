<template>
  <Suspense>
    <template #default>
      <slot />
    </template>
    <template #fallback>
      <div class="loading loading-lg m-2 p-2"></div>
    </template>
  </Suspense>
</template>
