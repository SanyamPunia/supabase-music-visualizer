<script>
	import { state } from '$lib/stores/stateStore';
	import { userName } from '$lib/stores/stateStore';
	import supabase from '$lib/supabase';
	import { fade } from 'svelte/transition';

	async function signIn(e) {
		const formData = new FormData(e.target);
		const { user, session, error } = await supabase.auth.signIn({
			email: formData.get('email'),
			password: formData.get('password')
		});
		if (error) {
			alert(error.message);
		} else {
			let user_name = user.email.split('@')[0];
			state.set('home');
			userName.set(user_name);
		}
	}
	function setStateSignUp() {
		state.set('sign-up');
	}
</script>

<div class="pop-up" in:fade>
	<i
		class="fas fa-arrow-left"
		on:click={() => {
			state.set('home');
		}}
	/>
	<div class="auth-form">
		<form on:submit|preventDefault={signIn}>
			<input name="email" type="email" required autocomplete="off" placeholder="Email..." />
			<input
				name="password"
				type="password"
				required
				autocomplete="off"
				placeholder="Password..."
			/>
			<button>Sign In</button>
		</form>
		<p>New User? <span on:click={setStateSignUp}>Sign Up</span> instead!</p>
	</div>
</div>

<style lang="scss">
	.pop-up {
		i {
			font-size: 24px;
			cursor: pointer;
		}
		.auth-form {
			p {
				font-family: 'Montserrat', sans-serif;
				text-align: center;

				span {
					color: #5c7aea;
					font-weight: bold;
					cursor: pointer;
					transition: 0.2s all ease;
				}
				span:hover {
					color: white;
				}
			}
			form {
				display: grid;
				* {
					margin: 1.5em 1em;
				}
				input {
					padding: 10px 30px;
					outline: none;
					font-size: 24px;
					border: 3px solid white;
					border-radius: 10px;
					font-size: 18px;
				}
				input:focus {
					transition: 0.2s all ease;
					border: 3px solid #5c7aea;
				}
				button {
					font-family: 'Montserrat', sans-serif;
					color: #fff;
					padding: 0.8em 3em;
					border: 2px solid #5c7aea;
					cursor: pointer;
					border-radius: 4px;
					font-size: 15px;
					background: transparent;
					transition: 0.2s all ease;
					font-weight: bold;
				}
				button:hover {
					background: #5c7aea;
					color: black;
				}
			}
		}
	}
</style>
