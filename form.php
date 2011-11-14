<?php sleep(2); ?>
<h2 class="mbox_title">Your company information <span class="mbox_icon mbox_icon_cross"></span></h2>
				<div class="mbox_main">
					<form action="#">
						<ul>
							<li>
								<label for="name">Name</label>
								<input type="text" name="name" id="name">
							</li>
							<li>
								<label for="email">E-mailaddress</label>
								<input type="text" name="email" id="email">
							</li>
							<li>
								<label for="company">Company</label>
								<input type="text" name="company" id="company">
							</li>
							<li>
								<label for="website">Website <span>for example: http://www.bubobox.com</span></label>
								<input type="text" name="website" id="website">
							</li>
						</ul>
				 </form>
				</div>
				<div class="mbox_footer">
					<a href="javascript:mb.close()" class="mbox_button mbox_gray">Skip</a>
					<a href="#" class="mbox_button mbox_green">Proceed</a>
				</div>
