<template>
	<main class="bg-[#f6f3ee]">
		<section class="px-4 pt-10 pb-6">
			<div class="mx-auto max-w-7xl">
				<div class="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
					<div>
						<div class="skeleton h-3 w-24"></div>
						<div class="skeleton mt-3 h-8 w-52"></div>
					</div>
					<div class="skeleton h-12 w-full max-w-lg"></div>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
					<div class="skeleton h-[300px] rounded-lg md:col-span-2 md:h-[400px] lg:col-span-1 lg:h-[352px]"></div>
					<div class="space-y-4">
						<div class="skeleton h-[180px] rounded-lg lg:h-[171px]"></div>
						<div class="skeleton h-[180px] rounded-lg lg:h-[171px]"></div>
					</div>
					<div class="space-y-4">
						<div class="skeleton h-[180px] rounded-lg lg:h-[171px]"></div>
						<div class="skeleton h-[180px] rounded-lg lg:h-[171px]"></div>
					</div>
				</div>
			</div>
		</section>

		<section class="px-4 py-10">
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div v-for="i in 4" :key="i" class="surface p-6">
					<div class="skeleton h-10 w-12"></div>
					<div class="skeleton mt-4 h-3 w-24"></div>
					<div class="skeleton mt-3 h-5 w-full"></div>
					<div class="skeleton mt-2 h-5 w-4/5"></div>
					<div class="skeleton mt-5 h-3 w-36"></div>
				</div>
			</div>
		</section>

		<section class="bg-white px-4 pt-6 pb-12">
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div v-for="i in 6" :key="i" class="surface overflow-hidden">
					<div class="skeleton h-56 rounded-none"></div>
					<div class="p-6">
						<div class="skeleton h-6 w-full"></div>
						<div class="skeleton mt-2 h-6 w-4/5"></div>
						<div class="skeleton mt-4 h-3 w-40"></div>
						<div class="skeleton mt-5 h-4 w-full"></div>
						<div class="skeleton mt-2 h-4 w-full"></div>
						<div class="skeleton mt-2 h-4 w-2/3"></div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>
