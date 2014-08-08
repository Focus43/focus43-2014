<form id="frmContact" class="container" name="contactForm" role="form" ng-submit="submit()" novalidate>
    <div class="row">
        <div class="col-sm-12">
            <div class="subheader form-group cubify">
                <h2>Get In Touch</h2>
                <div ng-show="response.ok">
                    <p>{{ response.msg }}</p>
                </div>
                <div ng-hide="response.ok">
                    <?php $a = new Area('Contact Us'); $a->display($c); ?>
                </div>
            </div>
        </div>
    </div>

    <div class="form-body">
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group cubify">
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
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group cubify">
                    <button type="submit" class="btn btn-lg btn-block" ng-disabled="isValid()" ng-class="{'processing':processing}">
                        <span ng-hide="isValid()"><i class="fa fa-refresh fa-spin"></i> Send</span>
                        <span ng-show="isValid()">Name, Email &amp; Message Required</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>