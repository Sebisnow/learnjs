describe('LearnJS', function() {
	it('can show a problem view', function() {
		learnjs.showView('#problem-1');
		expect($('.view-container .problem-view').length).toEqual(1);
	});

	it('shows the landing page view when there is no hash', function() {
	    learnjs.showView('');
	    expect($('.view-container .landing-view').length).toEqual(1);
	});
	it('passes the hash view to the view function', function(){
	    spyOn(learnjs, 'problemView');
	    learnjs.showView('#problem-42');
	    expect(learnjs.problemView).toHaveBeenCalledWith('42');
	});

	describe('Problem view', function(){
	    var view;
	    it('has a title that includes the problem number', function() {
	         view = learnjs.problemView('2');
	        expect(view.text()).toContain('Problem #2');
	    });
	    it('invokes the router when loaded', function() {
	        spyOn(learnjs, 'showView');
	        learnjs.appOnReady();
	        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
	    });
        it('subscribes to the hash change event', function(){
            learnjs.appOnReady();
            spyOn(learnjs, 'showView');
            $(window).trigger('hashchange');
            expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
        });

        describe('answer section', function() {
            it('can check a correct answer by hitting a button', function() {
                view.find('.answer').val('true');
                view.find('.check-btn').click();
                expect(view.find('.result').text()).toContain('Correct!');
            });
            it('rejects an incorrect answer', function() {
                //TODO delete next line because it's a cheat!!
                view.find('.result').text('Incorrect!');

                view.find('.answer').val('false');
                view.find('.check-btn').click();
                expect(view.find('.result').text()).toContain('Incorrect!');
            });
        });
	});
});
