<script setup lang="ts">

	useHead({
		title: 'Sign In',
		meta: [
		{ 
			name: 'description', 
			content: 'Sign In , Sripreecha Holding ' 
		},
		{
			name: 'keywords',
			content: 'Sign In, Sripreecha Holding , Yanma Thailand'
		},
		],
	})

	// sweetalert2
	const { $swal } = useNuxtApp()

	// create const for useCookie()
	const token = useCookie('token', {
		maxAge: 60 * 60, // 1 hour
		// expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 1 week
	})

	// ref const for email and password
	const email = ref('')
	const password = ref('')

	// useFormRules() for email and password
	const { ruleEmail, rulePassLen, ruleRequired } = useFormRules()

	// useRoute() for redirect
	const router = useRouter()

	// submit form
	const submit = async () => {

		// console.log(ruleEmail(email.value))
		
		// check form is valid
		if (ruleRequired(email.value) == true && ruleEmail(email.value) == true && rulePassLen(password.value) == true) {

			// console.log(email.value, password.value)

			// useRuntimeConfig() for get env
			const config = useRuntimeConfig()
			const STRAPI_URL: string = config.strapi.url

			// login strapi with usefetch()
			const { data, error } = await useFetch(`${STRAPI_URL}/auth/local`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"identifier": email.value,
					"password": password.value
				}),
			})

			// check error
			if (error.value != null) { // error
				
				if(error.value.status === 400){
					// console.log('Login failed! Please check your email and password.')
					$swal.fire({
						icon: 'error',
						title: 'เข้าสู่ระบบไม่สำเร็จ',
						text: 'กรุณาตรวจสอบอีเมล์และรหัสผ่านของคุณ',
						confirmButtonText: 'ปิดหน้าต่าง'
					})
				}else{
					console.log('Request failed:', error.value.message)
				}

			}else{ // success

				let timerInterval: any
				$swal.fire({
					title: 'กำลังเข้าสู่ระบบ',
					html: 'กรุณารอสักครู่ <b></b> วินาที',
					timer: 3000,
					timerProgressBar: true,
					didOpen: () => {
						$swal.showLoading()
						timerInterval = setInterval(() => {
						const content = $swal.getHtmlContainer()
						if (content) {
							const b = content.querySelector('b')
							if (b) {
								b.textContent =$swal.getTimerLeft() / 1000
							}
						}
						}, 100)
					},
					willClose: () => {
						clearInterval(timerInterval)
					}
				}).then( async (result: any) => {
					if(result.dismiss === $swal.DismissReason.timer) {

						// set token to cookie
						token.value = (data as { value: { jwt: string } }).value.jwt

						// redirect to dashboard
						await router.push({path:'/backend/dashboard'})
					}
				})

			}

		}

	}

	
</script>

<template>
	<VContainer fluid class="fill-height pa-0">
		<VRow no-gutters align="center" justify="center" class="fill-height">
            <VCol class="hidden-sm-and-down fill-height  " md="6" lg="6">
				<VImg
					src="/images/logo/logo_sripreecha.webp"
					cover width="85%" 
					class=" mx-auto my-auto rounded-xl rounded-ts-0 rounded-bs-0 d-flex align-center justify-center"
				>
				</VImg>
			</VCol>
			<VCol cols="12" md="6" lg="6" sm="6">
				<VRow no-gutters align="center" justify="center">
					<VCol cols="12" md="6" class="pa-3">
						<h2>เข้าสู่ระบบ ศรีปรีชาโฮลดิ้ง</h2>
						<p class="text-medium-emphasis">ป้อนอีเมล์และรหัสผ่านสำหรับเข้าใช้งาน</p>

						<VForm @submit.prevent="submit" class="mt-7">
							<div class="mt-1">
								<!-- <label class="label text-grey-darken-2" for="email">Email</label> -->
								<VTextField
									label="Email"
									v-model="email"
									:rules="[ruleRequired, ruleEmail]"
									prepend-inner-icon="fluent:mail-24-regular"
									id="email"
									name="email"
									type="email"
								/>
							</div>
							<div class="mt-1">
								<!-- <label class="label text-grey-darken-2" for="password">Password</label> -->
								<VTextField
									label="Password"
									v-model="password"
									:rules="[ruleRequired, rulePassLen]"
									prepend-inner-icon="fluent:password-20-regular"
									id="password"
									name="password"
									type="password"
								/>
							</div>
							<div class="mt-5">
								<VBtn type="submit" block min-height="44" class="gradient primary">Sign In</VBtn>
							</div>
						</VForm>
						<!-- <p class="text-center mt-10">
							<span
								>ยังไม่ได้เป็นสมาชิก ?
								<NuxtLink to="/signup" class="font-weight-bold text-primary"
									>ลงทะเบียนที่นี่</NuxtLink
								></span
							>
						</p> -->
					</VCol>
				</VRow>
			</VCol>
		</VRow>
	</VContainer>
</template>

<style scoped>

</style>