.PHONY: upload
upload:
	git add .
	git commit -m "auto-upload"
	git push
