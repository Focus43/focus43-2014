<div class="page-content" tpl-contact ng-class="animClass">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <label class="sr-only">Name</label>
                    <input required ng-model="form_data.name" type="text" name="name" class="form-control input-lg" placeholder="Name" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group cubify">
                    <label class="sr-only">Email</label>
                    <input required ng-model="form_data.email" type="email" name="email" class="form-control input-lg" placeholder="Email" />
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group cubify">
                    <label class="sr-only">Phone</label>
                    <input ng-model="form_data.phone" type="tel" name="phone" class="form-control input-lg" placeholder="Phone" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group cubify">
                    <label class="sr-only">Message</label>
                    <textarea required ng-model="form_data.message" name="message" class="form-control input-lg" rows="6" placeholder="Whats Up?"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>